export function assertHasBeenDefined<T>(value: T | undefined, path: string): asserts value is T {
    if (value === undefined) throw new Error(`assertHasBeenDefined failed: ${path} is undefined`);
}

export interface IReplay {
    name: string | null;
    recordedBy: string | null;
    rocketLeagueId: string;
    date: Date;
    matchType: string;
    playlist: string;
    teamSize: number;
    mapCode: string;
    matchGuid: string;
    server: {
        id: string;
        name: string;
        region: string;
    };
    blue: ITeam;
    orange: ITeam;
    spectators: IPlayer[];
    teamJoins: ITeamJoin[];
    replayVersion: number;
    gameVersion: number;
    buildId: number;
    buildVersion: string;
}

export interface ICoreStats {
    score: number;
    goals: number;
    goalsAgainst: number;
    assists: number;
    shots: number;
    shotsAgainst: number;
    saves: number;
}

export interface ITeam {
    name: string;
    color: string;
    stats: {
        core: ICoreStats;
    };
    colors: ITeamColors | null;
    players: ITeamPlayer[];
}

export interface ITeamColors {
    blueFlag: boolean;
    blueColor: number;
    orangeFlag: boolean;
    orangeColor: number;
}

export interface IPartyLeader {
    name: string | null;
    platform: string;
    platformId: string;
}

export interface IPlayer {
    name: string;
    platform: string;
    platformId: string;
    partyLeader: IPartyLeader | null;
    clubId: string | null;
}

export interface ITeamPlayer extends IPlayer {
    stats: {
        core: ICoreStats;
        demos: {
            inflicted: string[];
            taken: string[];
        };
    };
}

export interface ITeamJoin {
    player: string;
    team: "blue" | "orange" | "spectator";
    timeInSeconds: number;
}

export interface ICarData {
    pos_x?: number;
    pos_y?: number;
    pos_z?: number;
    quat_w?: number;
    quat_x?: number;
    quat_y?: number;
    quat_z?: number;
    vel_x?: number;
    vel_y?: number;
    vel_z?: number;
    ang_vel_x?: number;
    ang_vel_y?: number;
    ang_vel_z?: number;
    throttle?: number;
    steer?: number;
    handbrake?: false;
}
