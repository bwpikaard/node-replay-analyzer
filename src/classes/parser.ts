import {assertHasBeenDefined, type ITeamJoin} from "../types";
import type {ActorObject} from "../updated-actors";
import {Actor} from "./actor";
import type {BaseHandler} from "./base-handler";
import {CameraSettings} from "./camera";
import {Car} from "./car";
import {Game} from "./game";
import {GameEvent} from "./game-event";
import {Player} from "./player";
import type {Replay} from "./replay";
import {Team} from "./team";

export const Handlers: Array<typeof BaseHandler> = [Game, GameEvent, Team, Player, Car, CameraSettings];

const TrackDeltas: Array<ActorObject> = [];

export class Parser {
    public game = new Game();

    public gameEvent = new GameEvent();

    public blueTeam = new Team(this, "blue");

    public orangeTeam = new Team(this, "orange");

    public players: Player[] = [];

    private actors = new Map<number, Actor>();

    public actorIdToPlayerMap = new Map<number, Player>();

    public actorIdToTeamMap = new Map<number, Team>();

    public playerActorIdToCarActorIdMap = new Map<number, number>();

    public carActorIdToPlayerActorIdMap = new Map<number, number>();

    public carIdsToCollect = new Set<number>();

    public handledDemos = new Set<string>();

    public teamJoins: ITeamJoin[] = [];

    public readonly gameStartTime: number;

    constructor(public readonly replay: Replay) {
        this.gameStartTime = replay.boxcarsReplay.network_frames.frames[0].time;
    }

    parseFrames(): void {
        const handledActors = new Set<number>();

        for (const [frameNumber, frame] of this.replay.boxcarsReplay.network_frames.frames.entries()) {
            for (const deletedActor of frame.deleted_actors) {
                this.actors.delete(deletedActor);
                handledActors.delete(deletedActor);
                this.actorIdToPlayerMap.delete(deletedActor);
                this.actorIdToTeamMap.delete(deletedActor);
                this.playerActorIdToCarActorIdMap.delete(deletedActor);
                this.carActorIdToPlayerActorIdMap.delete(deletedActor);
            }

            for (const newActor of frame.new_actors) {
                if (this.actors.has(newActor.actor_id)) {
                    const oldActor = this.actors.get(newActor.actor_id);
                    if (oldActor?.objectName !== this.replay.boxcarsReplay.objects[newActor.object_id])
                        throw new Error("New actor created with a different objectId than an existing actor");
                }

                if (handledActors.has(newActor.actor_id)) continue;

                const handler = Handlers.find(h => h.canHandle(this.replay.boxcarsReplay.objects[newActor.object_id]));

                const actor = new Actor(
                    newActor.actor_id,
                    newActor.object_id,
                    this.replay.boxcarsReplay.objects[newActor.object_id],
                    this.replay.boxcarsReplay.names[newActor.name_id],
                    handler,
                );
                this.actors.set(actor.actorId, actor);
                handledActors.add(actor.actorId);
            }

            for (const updatedActor of frame.updated_actors) {
                updatedActor.object_name = this.replay.boxcarsReplay.objects[updatedActor.object_id];
                Actor.assertUpdatedActor(updatedActor);

                const actor = this.actors.get(updatedActor.actor_id);
                assertHasBeenDefined(actor, "parser.parseFrames.updatedActor.actor");

                const [, attributeValue] = Object.entries(updatedActor.attribute)[0];
                actor.addAttribute(updatedActor.object_name, attributeValue);

                if (TrackDeltas.includes(updatedActor.object_name))
                    actor.addDeltaAttribute(updatedActor.object_name, attributeValue, frameNumber, frame.time);
            }

            for (const actor of Array.from(this.actors.values()).sort((a, b) => a.priority - b.priority)) {
                if (actor.handler) actor.handler.handleActor(this, actor, frameNumber, frame.time, frame.delta);
            }
        }
    }
}
