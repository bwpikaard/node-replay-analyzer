import type {Actor} from "./actor";
import {BaseHandler} from "./base-handler";
import type {Parser} from "./parser";

export class Game extends BaseHandler {
    private _matchGuid: string | undefined;

    private _serverId: string | undefined;

    private _serverName: string | undefined;

    private _serverRegion: string | undefined;

    private _playlist: string | undefined;

    private _mutatorIndex: number | undefined;

    public get matchGuid(): string | undefined {
        return this._matchGuid;
    }

    public get serverId(): string | undefined {
        return this._serverId;
    }

    public get serverName(): string | undefined {
        return this._serverName;
    }

    public get serverRegion(): string | undefined {
        return this._serverRegion;
    }

    public get playlist(): string | undefined {
        return this._playlist;
    }

    public get mutatorIndex(): number | undefined {
        return this._mutatorIndex;
    }

    public set matchGuid(v: string) {
        this._matchGuid = v;
    }

    public set serverId(v: string) {
        this._serverId = v;
    }

    public set serverName(v: string) {
        this._serverName = v;
    }

    public set serverRegion(v: string) {
        this._serverRegion = v;
    }

    public set playlist(v: string) {
        this._playlist = v;
    }

    public set mutatorIndex(v: number) {
        this._mutatorIndex = v;
    }

    static canHandle(objectName: string): boolean {
        return objectName.endsWith(":GameReplicationInfoArchetype");
    }

    static handleActor(parser: Parser, actor: Actor): void {
        if (actor.hasAttribute("ProjectX.GRI_X:MatchGuid"))
            parser.game.matchGuid = actor.getAttribute("ProjectX.GRI_X:MatchGuid");

        if (actor.hasAttribute("ProjectX.GRI_X:GameServerID"))
            parser.game.serverId = actor.getAttribute("ProjectX.GRI_X:GameServerID");

        if (actor.hasAttribute("Engine.GameReplicationInfo:ServerName"))
            parser.game.serverName = actor.getAttribute("Engine.GameReplicationInfo:ServerName");

        if (actor.hasAttribute("ProjectX.GRI_X:ReplicatedServerRegion"))
            parser.game.serverRegion = actor.getAttribute("ProjectX.GRI_X:ReplicatedServerRegion");

        if (actor.hasAttribute("ProjectX.GRI_X:ReplicatedGamePlaylist"))
            parser.game.playlist = actor.getAttribute("ProjectX.GRI_X:ReplicatedGamePlaylist");
    }
}
