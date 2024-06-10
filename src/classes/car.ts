import type {ICarData} from "../types";
import {assertHasBeenDefined} from "../types";
import type {Actor} from "./actor";
import {BaseHandler} from "./base-handler";
import type {Parser} from "./parser";

export class Car extends BaseHandler {
    static canHandle(objectName: string): boolean {
        return objectName === "Archetypes.Car.Car_Default";
    }

    static handleActor(parser: Parser, actor: Actor, frameNumber: number): void {
        if (!actor.hasAttribute("Engine.Pawn:PlayerReplicationInfo")) return;

        const playerActorId = actor.getAttribute("Engine.Pawn:PlayerReplicationInfo").actor;
        if (playerActorId === -1) {
            Car.handleDemo(parser, actor, frameNumber);
            return;
        }

        const player = parser.actorIdToPlayerMap.get(playerActorId);
        assertHasBeenDefined(player, "car.handleActor.player");

        parser.playerActorIdToCarActorIdMap.set(playerActorId, actor.actorId);
        parser.carActorIdToPlayerActorIdMap.set(actor.actorId, playerActorId);

        const rbState = actor.hasAttribute("TAGame.RBActor_TA:ReplicatedRBState")
            ? actor.getAttribute("TAGame.RBActor_TA:ReplicatedRBState")
            : {sleeping: true};

        if (!rbState.sleeping) {
            parser.carIdsToCollect.add(actor.actorId);
            player.carData.set(frameNumber, Car.getCarData(actor));
        }

        Car.handleDemo(parser, actor, frameNumber);
    }

    static handleDemo(parser: Parser, actor: Actor, frameNumber: number): void {
        if (
            !actor.hasAttribute("TAGame.Car_TA:ReplicatedDemolish") &&
            !actor.hasAttribute("TAGame.Car_TA:ReplicatedDemolishGoalExplosion")
        )
            return;

        const key = actor.hasAttribute("TAGame.Car_TA:ReplicatedDemolish")
            ? "TAGame.Car_TA:ReplicatedDemolish"
            : "TAGame.Car_TA:ReplicatedDemolishGoalExplosion";
        const demoData = actor.getAttribute(key);
        const attackerCarId = demoData.attacker;
        const victimCarId = demoData.victim;

        if (attackerCarId !== -1 && victimCarId !== -1 && attackerCarId < 1e9 && victimCarId < 1e9) {
            const attackerPlayerId = parser.carActorIdToPlayerActorIdMap.get(attackerCarId);
            const victimPlayerId = parser.carActorIdToPlayerActorIdMap.get(victimCarId);
            assertHasBeenDefined(attackerPlayerId, "car.handleDemo.attackerPlayerId");
            assertHasBeenDefined(victimPlayerId, "car.handleDemo.victimPlayerId");
            if (attackerPlayerId === -1 || victimPlayerId === -1) return;

            const attackerPlayer = parser.actorIdToPlayerMap.get(attackerPlayerId);
            const victimPlayer = parser.actorIdToPlayerMap.get(victimPlayerId);
            assertHasBeenDefined(attackerPlayer, "car.handleDemo.attackerPlayer");
            assertHasBeenDefined(victimPlayer, "car.handleDemo.victimPlayer");

            const demoKey = `${Object.values(demoData.attack_velocity).reduce((p, c) => p + c, 0)}|${Object.values(demoData.victim_velocity).reduce((p, c) => p + c, 0)}`;
            if (parser.handledDemos.has(demoKey)) return;
            attackerPlayer.demos.inflicted.push({
                attacker: attackerPlayer,
                victim: victimPlayer,
                attackVelocity: demoData.attack_velocity,
                victimVelocity: demoData.victim_velocity,
                frameNumber: frameNumber,
            });
            victimPlayer.demos.taken.push({
                attacker: attackerPlayer,
                victim: victimPlayer,
                attackVelocity: demoData.attack_velocity,
                victimVelocity: demoData.victim_velocity,
                frameNumber: frameNumber,
            });
            parser.handledDemos.add(demoKey);
            actor.deleteAttribute(key);
        }
    }

    static getCarData(actor: Actor): ICarData {
        const carData: ICarData = {};

        if (actor.hasAttribute("TAGame.RBActor_TA:ReplicatedRBState")) {
            const attributeData = actor.getAttribute("TAGame.RBActor_TA:ReplicatedRBState");
            Object.assign(carData, {
                pos_x: attributeData.location.x,
                pos_y: attributeData.location.y,
                pos_z: attributeData.location.z,
                quat_w: attributeData.rotation.w,
                quat_x: attributeData.rotation.x,
                quat_y: attributeData.rotation.y,
                quat_z: attributeData.rotation.z,
                vel_x: attributeData.linear_velocity.x,
                vel_y: attributeData.linear_velocity.y,
                vel_z: attributeData.linear_velocity.z,
                ang_vel_x: attributeData.angular_velocity.x,
                ang_vel_y: attributeData.angular_velocity.y,
                ang_vel_z: attributeData.angular_velocity.z,
            });
        }

        if (actor.hasAttribute("TAGame.Vehicle_TA:ReplicatedThrottle")) {
            const attributeData = actor.getAttribute("TAGame.Vehicle_TA:ReplicatedThrottle");
            Object.assign(carData, {throttle: attributeData});
        } else Object.assign(carData, {throttle: null});

        if (actor.hasAttribute("TAGame.Vehicle_TA:ReplicatedSteer")) {
            const attributeData = actor.getAttribute("TAGame.Vehicle_TA:ReplicatedSteer");
            Object.assign(carData, {steer: attributeData});
        } else Object.assign(carData, {steer: null});

        if (actor.hasAttribute("TAGame.Vehicle_TA:bReplicatedHandbrake")) {
            const attributeData = actor.getAttribute("TAGame.Vehicle_TA:bReplicatedHandbrake");
            Object.assign(carData, {handbrake: attributeData});
        } else Object.assign(carData, {handbrake: false});

        return Car.convertQuatToRot(Car.rescaleToUU(carData));
    }

    static rescaleToUU(carData: ICarData): ICarData {
        const correction_dict = {vel_x: 0.1, vel_y: 0.1, vel_z: 0.1, ang_vel_x: 0.1, ang_vel_y: 0.1, ang_vel_z: 0.1};

        for (const [_item, _divisor] of Object.entries(correction_dict)) {
            try {
                carData[_item] /= _divisor;
            } catch {
                continue;
            }
        }

        return carData;
    }

    static convertQuatToRot(carData: ICarData): ICarData {
        const w = carData["quat_w"];
        const x = carData["quat_x"];
        const y = carData["quat_y"];
        const z = carData["quat_z"];

        if (w === undefined || x === undefined || y === undefined || z === undefined) return carData;

        const sinr = 2.0 * (w * x + y * z);
        const cosr = 1.0 - 2.0 * (x * x + y * y);
        const roll = Math.atan2(sinr, cosr);

        const sinp = 2.0 * (w * y - z * x);
        let pitch: number;

        if (Math.abs(sinp) >= 1) pitch = Car.copySign(Math.PI / 2, sinp);
        else pitch = Math.asin(sinp);

        const siny = 2.0 * (w * z + x * y);
        const cosy = 1.0 - 2.0 * (y * y + z * z);
        const yaw = Math.atan2(siny, cosy);
        carData["rot_x"] = pitch;
        carData["rot_y"] = yaw;
        carData["rot_z"] = roll;

        return carData;
    }

    static copySign(x: number, y: number): number {
        return Math.sign(x) === Math.sign(y) ? x : -x;
    }
}
