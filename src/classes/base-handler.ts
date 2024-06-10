/* eslint-disable @typescript-eslint/no-unused-vars */
import type {Actor} from "./actor";
import type {Parser} from "./parser";

export abstract class BaseHandler {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {}

    static canHandle(objectName: string): boolean {
        return false;
    }

    static handleActor(
        parser: Parser,
        actor: Actor,
        frameNumber: number,
        frameTime: number,
        frameTimeDelta: number,
    ): void {
        return;
    }
}
