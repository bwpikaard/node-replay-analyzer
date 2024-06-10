import type {Actor} from "./actor";
import {BaseHandler} from "./base-handler";
import type {Parser} from "./parser";

export class GameEvent extends BaseHandler {
    public gameStartTime: number | undefined;

    static canHandle(objectName: string): boolean {
        return objectName === "Archetypes.GameEvent.GameEvent_Soccar";
    }

    static handleActor(parser: Parser, actor: Actor, frameNumber: number): void {}
}
