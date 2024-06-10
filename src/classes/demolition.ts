export interface Demolition {
    attacker: Player;
    victim: Player;
    attackVelocity: {
        x: number;
        y: number;
        z: number;
    };
    victimVelocity: {
        x: number;
        y: number;
        z: number;
    };
    frameNumber: number;
}
