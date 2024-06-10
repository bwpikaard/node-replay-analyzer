import type {BoxcarsUpdatedActor} from "../boxcars-schemas";
import {assertHasBeenDefined} from "../types";
import type {ActorAttribute, ActorObject, UpdatedActor} from "../updated-actors";
import type {BaseHandler} from "./base-handler";
import {Handlers} from "./parser";

export class Actor {
    public readonly priority: number = Infinity;

    private _attributes = new Map<Partial<ActorObject>, ActorAttribute>();

    private _deltaAttributes = new Map<
        Partial<ActorObject>,
        Map<number, {frameNumber: number; time: number; value: ActorAttribute}>
    >();

    constructor(
        public readonly actorId: number,
        public readonly objectId: number,
        public readonly objectName: string,
        public readonly name: string,
        public readonly handler: typeof BaseHandler | undefined,
    ) {
        if (handler) this.priority = Handlers.indexOf(handler);
    }

    public addAttribute<T extends UpdatedActor>(name: ActorObject<T>, value: ActorAttribute<T>): void {
        this._attributes.set(name, value);
    }

    public addDeltaAttribute(name: ActorObject, value: ActorAttribute, frameNumber: number, time: number): void {
        const deltas = this._deltaAttributes.get(name);

        if (deltas)
            deltas.set(frameNumber, {
                frameNumber: frameNumber,
                time: time,
                value: value,
            });
        else
            this._deltaAttributes.set(
                name,
                new Map().set(frameNumber, {
                    frameNumber: frameNumber,
                    time: time,
                    value: value,
                }),
            );
    }

    public get deltaAttributes(): Array<Array<{frameNumber: number; time: number; value: ActorAttribute}>> {
        return Array.from(this._deltaAttributes.values()).map(f => Array.from(f.values()));
    }

    public hasAttribute(name: ActorObject): boolean {
        return this._attributes.has(name);
    }

    public getAttribute<Name extends ActorObject>(name: Name): Extract<UpdatedActor, {object_name: Name}>["attribute"] {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this._attributes.get(name) as any;
    }

    public deleteAttribute(name: ActorObject): void {
        this._attributes.delete(name);
    }

    static assertUpdatedActor(actor: BoxcarsUpdatedActor): asserts actor is UpdatedActor {
        assertHasBeenDefined(actor.object_name, "actor.assertUpdatedActor.object_name");
    }
}
