import {assertHasBeenDefined} from "../types";
import type {Actor} from "./actor";
import {BaseHandler} from "./base-handler";
import type {Parser} from "./parser";

export class CameraSettings extends BaseHandler {
    static canHandle(objectName: string): boolean {
        return objectName === "TAGame.Default__CameraSettingsActor_TA";
    }

    static handleActor(
        parser: Parser,
        actor: Actor,
        frameNumber: number,
        frameTime: number,
        frameTimeDelta: number,
    ): void {
        if (!actor.hasAttribute("TAGame.CameraSettingsActor_TA:PRI")) return;

        const player = parser.actorIdToPlayerMap.get(actor.getAttribute("TAGame.CameraSettingsActor_TA:PRI").actor);
        assertHasBeenDefined(player, "camera.handleActor.player");

        player.cameraSettings = actor.getAttribute("TAGame.CameraSettingsActor_TA:ProfileSettings");
    }
}
