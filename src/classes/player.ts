import type {ICameraSettings, ICarData, IPartyLeader} from "../types";
import {assertHasBeenDefined, type IPlayer, type ITeamPlayer} from "../types";
import {type ActorAttribute, type Engine_PlayerReplicationInfo_UniqueId} from "../updated-actors";
import type {Actor} from "./actor";
import {BaseHandler} from "./base-handler";
import type {Demolition} from "./demolition";
import type {Parser} from "./parser";
import {Team} from "./team";

export class Player extends BaseHandler {
    private _team: Team | undefined;

    private _score: number = 0;

    private _goals: number = 0;

    private _assists: number = 0;

    private _shots: number = 0;

    private _saves: number = 0;

    private _partyLeader: IPartyLeader | undefined;

    private _clubId: string | undefined;

    private _cameraSettings: ICameraSettings | undefined;

    public ping: number[] = [];

    public carData = new Map<number, ICarData>();

    public demos: Record<"inflicted" | "taken", Demolition[]> = {
        inflicted: [],
        taken: [],
    };

    constructor(
        private readonly parser: Parser,
        public readonly name: string,
        public readonly platform: string,
        public readonly platformId: string,
    ) {
        super();
    }

    public get team(): Team | undefined {
        return this._team;
    }

    public get score(): number {
        return this._score;
    }

    public get goals(): number {
        return this._goals;
    }

    public get assists(): number {
        return this._assists;
    }

    public get shots(): number {
        return this._shots;
    }

    public get saves(): number {
        return this._saves;
    }

    public get partyLeader(): IPartyLeader | undefined {
        return this._partyLeader;
    }

    public get clubId(): string | undefined {
        return this._clubId;
    }

    public get cameraSettings(): ICameraSettings | undefined {
        return this._cameraSettings;
    }

    public set team(v: Team | undefined) {
        this._team = v;
    }

    public set score(v: number) {
        this._score = v;
    }

    public set goals(v: number) {
        this._goals = v;
    }

    public set assists(v: number) {
        this._assists = v;
    }

    public set shots(v: number) {
        this._shots = v;
    }

    public set saves(v: number) {
        this._saves = v;
    }

    public set partyLeader(v: IPartyLeader) {
        this._partyLeader = v;
    }

    public set clubId(v: string) {
        this._clubId = v;
    }

    public set cameraSettings(v: ICameraSettings) {
        this._cameraSettings = v;
    }

    toJSON(teamPlayer: true): ITeamPlayer;

    toJSON(teamPlayer: false): IPlayer;

    toJSON(teamPlayer = false): IPlayer {
        const player: IPlayer = {
            name: this.name,
            platform: this.platform,
            platformId: this.platformId,
            partyLeader: this.partyLeader ?? null,
            clubId: this.clubId ?? null,
            ping: {
                min: Math.min(...this.ping),
                max: Math.max(...this.ping),
                avg: this.ping.reduce((p, c) => p + c, 0) / this.ping.length,
            },
        };
        if (teamPlayer) {
            assertHasBeenDefined(this.team, "player.toJSON.team");
            assertHasBeenDefined(this.cameraSettings, "player.toJSON.player.cameraSettings");

            const otherTeam = this.team.color === "blue" ? this.parser.orangeTeam : this.parser.blueTeam;
            const teamPlayer: ITeamPlayer = {
                ...player,
                stats: {
                    core: {
                        score: this.score,
                        goals: this.goals,
                        goalsAgainst: otherTeam.score,
                        assists: this.assists,
                        shots: this.shots,
                        shotsAgainst: otherTeam.players.reduce((p, c) => p + c.shots, 0),
                        saves: this.saves,
                    },
                    demos: {
                        inflicted: this.demos.inflicted.map(demo => demo.victim.name),
                        taken: this.demos.taken.map(demo => demo.attacker.name),
                    },
                },
                camera: this.cameraSettings,
            };
            return teamPlayer;
        } else {
            return player;
        }
    }

    static parsePlatform(uniqueId: ActorAttribute<Engine_PlayerReplicationInfo_UniqueId>): {
        platform: string;
        platformId: string;
    } {
        const type = Object.keys(uniqueId.remote_id)[0];
        const value = uniqueId.remote_id[type];

        if (type === "Steam") return {platform: "steam", platformId: value};
        else if (type === "Epic") return {platform: "epic", platformId: value};
        else if (type === "Xbox") return {platform: "xbox", platformId: value};
        else if (type === "PlayStation") return {platform: "psn", platformId: value.online_id};
        throw new Error(`Unknown platform: ${type} ${JSON.stringify(value, null, 4)}`);
    }

    static findPlayerByPlatform(parser: Parser, platform: string, platformId: string): Player | null {
        return parser.players.find(p => p.platform === platform && p.platformId === platformId) ?? null;
    }

    static canHandle(objectName: string): boolean {
        return objectName === "TAGame.Default__PRI_TA";
    }

    static handleActor(parser: Parser, actor: Actor, frameNumber: number, frameTime: number): void {
        if (!actor.hasAttribute("Engine.PlayerReplicationInfo:PlayerName")) return;

        /* ------------- Locate Player ------------- */
        let player: Player;
        if (parser.actorIdToPlayerMap.has(actor.actorId)) player = parser.actorIdToPlayerMap.get(actor.actorId)!;
        else {
            const platform = Player.parsePlatform(actor.getAttribute("Engine.PlayerReplicationInfo:UniqueId"));
            const foundPlayer = Player.findPlayerByPlatform(parser, platform.platform, platform.platformId);
            if (foundPlayer) player = foundPlayer;
            else {
                player = new Player(
                    parser,
                    actor.getAttribute("Engine.PlayerReplicationInfo:PlayerName"),
                    platform.platform,
                    platform.platformId,
                );
                parser.players.push(player);
            }

            parser.actorIdToPlayerMap.set(actor.actorId, player);
        }

        /* ------------- Party Leader ------------- */
        if (actor.hasAttribute("TAGame.PRI_TA:PartyLeader")) {
            const partyLeaderPlatform = Player.parsePlatform(actor.getAttribute("TAGame.PRI_TA:PartyLeader"));
            const foundPlayer = Player.findPlayerByPlatform(
                parser,
                partyLeaderPlatform.platform,
                partyLeaderPlatform.platformId,
            );
            player.partyLeader = {name: foundPlayer?.name ?? null, ...partyLeaderPlatform};
        }

        /* ------------- Club ------------- */
        if (actor.hasAttribute("TAGame.Team_TA:ClubID")) player.clubId = actor.getAttribute("TAGame.Team_TA:ClubID");

        /* ------------- Assign Team ------------- */
        if (actor.hasAttribute("Engine.PlayerReplicationInfo:Team")) {
            const playerTeamActorId = actor.getAttribute("Engine.PlayerReplicationInfo:Team").actor;
            if (playerTeamActorId !== -1) {
                const team = Team.getTeamByActorId(parser, playerTeamActorId);
                if (player.team !== team)
                    parser.teamJoins.push({
                        player: player.name,
                        team: team.color,
                        timeInSeconds: frameTime - parser.gameStartTime,
                    });
                player.team = team;
            } else {
                if (player.team !== undefined)
                    parser.teamJoins.push({
                        player: player.name,
                        team: "spectator",
                        timeInSeconds: frameTime - parser.gameStartTime,
                    });
                player.team = undefined;
            }
        } else player.team = undefined;

        /* ------------- Stats ------------- */
        if (actor.hasAttribute("TAGame.PRI_TA:MatchScore"))
            player.score = actor.getAttribute("TAGame.PRI_TA:MatchScore");

        if (actor.hasAttribute("TAGame.PRI_TA:MatchGoals"))
            player.goals = actor.getAttribute("TAGame.PRI_TA:MatchGoals");

        if (actor.hasAttribute("TAGame.PRI_TA:MatchShots"))
            player.shots = actor.getAttribute("TAGame.PRI_TA:MatchShots");

        if (actor.hasAttribute("TAGame.PRI_TA:MatchAssists"))
            player.assists = actor.getAttribute("TAGame.PRI_TA:MatchAssists");

        if (actor.hasAttribute("TAGame.PRI_TA:MatchSaves"))
            player.saves = actor.getAttribute("TAGame.PRI_TA:MatchSaves");

        /* ------------- Ping ------------- */
        if (actor.hasAttribute("Engine.PlayerReplicationInfo:Ping")) {
            player.ping.push(actor.getAttribute("Engine.PlayerReplicationInfo:Ping"));
            actor.deleteAttribute("Engine.PlayerReplicationInfo:Ping");
        }
    }
}
