import {assertHasBeenDefined, type ITeam} from "../types";
import type {ActorAttribute, TAGame_Team_TA_ClubColors} from "../updated-actors";
import type {Actor} from "./actor";
import {BaseHandler} from "./base-handler";
import type {Parser} from "./parser";
import type {Player} from "./player";

export class Team extends BaseHandler {
    private _name: string;

    private _score: number = 0;

    private _colors: ActorAttribute<TAGame_Team_TA_ClubColors> | undefined;

    constructor(
        private readonly parser: Parser,
        public readonly color: "blue" | "orange",
    ) {
        super();

        this._name = this.color === "blue" ? "Blue" : "Orange";
    }

    public get name(): string {
        return this._name;
    }

    public get score(): number {
        return this._score;
    }

    public get colors(): ActorAttribute<TAGame_Team_TA_ClubColors> | undefined {
        return this._colors;
    }

    public get players(): Player[] {
        return this.parser.players.filter(p => p.team?.color === this.color);
    }

    public set name(v: string) {
        this._name = v;
    }

    public set score(v: number) {
        this._score = v;
    }

    public set colors(v: ActorAttribute<TAGame_Team_TA_ClubColors>) {
        this._colors = v;
    }

    toJSON(): ITeam {
        return {
            name: this.name,
            color: this.color,
            players: this.players.map(p => p.toJSON(true)),
            stats: {
                core: {
                    score: 0,
                    goals: 0,
                    goalsAgainst: 0,
                    assists: 0,
                    shots: 0,
                    shotsAgainst: 0,
                    saves: 0,
                },
            },
            colors: this._colors
                ? {
                      blueFlag: this._colors.blue_flag,
                      blueColor: this._colors.blue_color,
                      orangeFlag: this._colors.orange_flag,
                      orangeColor: this._colors.orange_color,
                  }
                : null,
        };
    }

    static getTeamByActorId(parser: Parser, actorId: number): Team {
        const team = parser.actorIdToTeamMap.get(actorId);
        assertHasBeenDefined(team, "team.getTeamByActorId.team");
        return team;
    }

    static canHandle(objectName: string): boolean {
        return objectName === "Archetypes.Teams.Team0" || objectName === "Archetypes.Teams.Team1";
    }

    static handleActor(parser: Parser, actor: Actor): void {
        if (!parser.actorIdToTeamMap.has(actor.actorId)) {
            parser.actorIdToTeamMap.set(
                actor.actorId,
                actor.objectName === "Archetypes.Teams.Team0" ? parser.blueTeam : parser.orangeTeam,
            );
        }

        const team = parser.actorIdToTeamMap.get(actor.actorId)!;

        if (actor.hasAttribute("TAGame.Team_TA:ClubColors"))
            team.colors = actor.getAttribute("TAGame.Team_TA:ClubColors");

        if (actor.hasAttribute("TAGame.Team_TA:CustomTeamName"))
            team.name = actor.getAttribute("TAGame.Team_TA:CustomTeamName");

        if (actor.hasAttribute("Engine.TeamInfo:Score")) team.score = actor.getAttribute("Engine.TeamInfo:Score");
    }
}
