import {parse_replay_network} from "boxcars-wasm";
import {parse} from "date-fns";
import {writeFile} from "fs/promises";
import {join} from "path";

import type {BoxcarsReplay} from "../boxcars-schemas";
import {BoxcarsReplaySchema} from "../boxcars-schemas";
import {assertHasBeenDefined, type IReplay} from "../types";
import {Parser} from "./parser";

export class Replay {
    public readonly parser: Parser;

    constructor(public readonly boxcarsReplay: BoxcarsReplay) {
        this.parser = new Parser(this);
        this.parser.parseFrames();
    }

    toJSON(): IReplay {
        assertHasBeenDefined(this.parser.game.playlist, "replay.toJSON.parser.game.playlist");
        assertHasBeenDefined(this.parser.game.matchGuid, "replay.toJSON.parser.game.matchGuid");
        assertHasBeenDefined(this.parser.game.serverId, "replay.toJSON.parser.game.serverId");
        assertHasBeenDefined(this.parser.game.serverName, "replay.toJSON.parser.game.serverName");
        assertHasBeenDefined(this.parser.game.serverRegion, "replay.toJSON.parser.game.serverRegion");

        return {
            name: this.boxcarsReplay.properties.ReplayName ?? null,
            recordedBy: this.boxcarsReplay.properties.PlayerName ?? null,
            rocketLeagueId: this.boxcarsReplay.properties.Id,
            date: parse(this.boxcarsReplay.properties.Date, "yyyy-MM-dd kk-mm-ss", new Date()),
            matchType: this.boxcarsReplay.properties.MatchType,
            playlist: this.parser.game.playlist,
            teamSize: this.boxcarsReplay.properties.TeamSize,
            mapCode: this.boxcarsReplay.properties.MapName,
            matchGuid: this.parser.game.matchGuid,
            blue: this.parser.blueTeam.toJSON(),
            orange: this.parser.orangeTeam.toJSON(),
            spectators: this.parser.players.filter(p => !p.team).map(p => p.toJSON(false)),
            teamJoins: this.parser.teamJoins,
            server: {
                id: this.parser.game.serverId,
                name: this.parser.game.serverName,
                region: this.parser.game.serverRegion,
            },
            replayVersion: this.boxcarsReplay.properties.ReplayVersion,
            gameVersion: this.boxcarsReplay.properties.GameVersion,
            buildId: this.boxcarsReplay.properties.BuildID,
            buildVersion: this.boxcarsReplay.properties.BuildVersion,
        };
    }

    static parseReplay(data: Buffer): IReplay {
        const rawBoxcars = parse_replay_network(data);
        const boxcarsJSON = JSON.parse(new TextDecoder().decode(rawBoxcars));
        const validatedData = BoxcarsReplaySchema.parse(boxcarsJSON);

        // writeFile(
        //     join(__dirname, "..", "test.json"),
        //     `[\n${validatedData.network_frames.frames
        //         .flatMap((frame, frameNumber) => [
        //             frame.new_actors
        //                 .map(na =>
        //                     JSON.stringify({
        //                         type: "new",
        //                         fn: frameNumber,
        //                         actorId: na.actor_id,
        //                         object: validatedData.objects[na.object_id],
        //                         name: validatedData.names[na.name_id],
        //                     }),
        //                 )
        //                 .join(",\n"),
        //             frame.updated_actors
        //                 .map(ua =>
        //                     JSON.stringify({
        //                         type: "updated",
        //                         fn: frameNumber,
        //                         actorId: ua.actor_id,
        //                         object: validatedData.objects[ua.object_id],
        //                         data: ua.attribute,
        //                     }),
        //                 )
        //                 .join(",\n"),
        //             frame.deleted_actors
        //                 .map(da =>
        //                     JSON.stringify({
        //                         type: "deleted",
        //                         fn: frameNumber,
        //                         actorId: da,
        //                     }),
        //                 )
        //                 .join(",\n"),
        //         ])
        //         .filter(f => !!f)
        //         .join(",\n")}\n]`,
        // );

        return new Replay(validatedData).toJSON();
    }
}
