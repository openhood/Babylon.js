import { Gamepad } from "../gamepad";
import { DualShockPad, DualShockActuator, DualShockActuatorType, DualShockMapping } from './dualShockGamepad';

/**
 * Defines supported buttons for DualShock 3 gamepads
 */
export enum DualShock3Actuators {
    LeftStickAxisX  = "LeftStickAxisX",
    LeftStickAxisY  = "LeftStickAxisY",
    RightStickAxisX = "RightStickAxisX",
    RightStickAxisY = "RightStickAxisY",
    X               = "X",
    Circle          = "Circle",
    Square          = "Square",
    Triangle        = "Triangle",
    L1              = "L1",
    R1              = "R1",
    L2              = "L2",
    R2              = "R2",
    Select          = "Select",
    Start           = "Start",
    LeftStick       = "LeftStick",
    RightStick      = "RightStick",
    Up              = "Up",
    Down            = "Down",
    Left            = "Left",
    Right           = "Right",
    Ps              = "Ps"
}

/**
 * Defines a DualShock 3 gamepad
 */
export class DualShock3Pad extends DualShockPad {
    public static matchId(id: string): boolean {
        return id.search(/0?268/) !== -1;
    }

    /**
     * Creates a new DualShock3 gamepad object
     * @param id defines the id of this gamepad
     * @param index defines its index
     * @param gamepad defines the internal HTML gamepad object
     */
    constructor(id: string, index: number, gamepad: any) {
        const mapping = DualShock3Pad._buildMapping(gamepad);
        const leftStickAxisX = mapping.getAxisByAlias(DualShock3Actuators.LeftStickAxisX);
        const leftStickAxisY = mapping.getAxisByAlias(DualShock3Actuators.LeftStickAxisY);
        const rightStickAxisX = mapping.getAxisByAlias(DualShock3Actuators.RightStickAxisX);
        const rightStickAxisY = mapping.getAxisByAlias(DualShock3Actuators.RightStickAxisY);
        super(
            id,
            index,
            gamepad,
            leftStickAxisX ? leftStickAxisX.index : 0,
            leftStickAxisY ? leftStickAxisY.index : 1,
            rightStickAxisX ? rightStickAxisX.index : 2,
            rightStickAxisY ? rightStickAxisY.index : 3
        );
        this._mapping = mapping;
        this.type = Gamepad.DUALSHOCK3;
    }

    private static _buildMapping(gamepad: any): DualShockMapping {
        let axes = [];
        let buttons = [];
        if (gamepad.mapping == 'standard') {
            axes.push(new DualShockActuator(DualShock3Actuators.LeftStickAxisX, 0, DualShockActuatorType.Axis));
            axes.push(new DualShockActuator(DualShock3Actuators.LeftStickAxisY, 1, DualShockActuatorType.Axis));
            axes.push(new DualShockActuator(DualShock3Actuators.RightStickAxisX, 2, DualShockActuatorType.Axis));
            axes.push(new DualShockActuator(DualShock3Actuators.RightStickAxisY, 3, DualShockActuatorType.Axis));

            buttons.push(new DualShockActuator(DualShock3Actuators.X,         0,  DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock3Actuators.Circle,    1,  DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock3Actuators.Square,    2,  DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock3Actuators.Triangle,  3,  DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock3Actuators.L1,        4,  DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock3Actuators.L2,        5, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock3Actuators.R1,        6,  DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock3Actuators.R2,        7,  DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock3Actuators.Select,    8,  DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock3Actuators.Start,     9,  DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock3Actuators.LeftStick, 10, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock3Actuators.RightStick, 11, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock3Actuators.Up,        12, DualShockActuatorType.DPad));
            buttons.push(new DualShockActuator(DualShock3Actuators.Down,      13, DualShockActuatorType.DPad));
            buttons.push(new DualShockActuator(DualShock3Actuators.Left,      14, DualShockActuatorType.DPad));
            buttons.push(new DualShockActuator(DualShock3Actuators.Right,     15, DualShockActuatorType.DPad));
            buttons.push(new DualShockActuator(DualShock3Actuators.Ps,        16, DualShockActuatorType.Button));
        } else {
            axes.push(new DualShockActuator(DualShock3Actuators.LeftStickAxisX, 0, DualShockActuatorType.Axis));
            axes.push(new DualShockActuator(DualShock3Actuators.LeftStickAxisY, 1, DualShockActuatorType.Axis));
            axes.push(new DualShockActuator(DualShock3Actuators.RightStickAxisX, 2, DualShockActuatorType.Axis));
            axes.push(new DualShockActuator(DualShock3Actuators.RightStickAxisY, 3, DualShockActuatorType.Axis));

            buttons.push(new DualShockActuator(DualShock3Actuators.Select,     0, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock3Actuators.LeftStick,  1, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock3Actuators.RightStick, 2, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock3Actuators.Start,      3, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock3Actuators.Up,         4, DualShockActuatorType.DPad));
            buttons.push(new DualShockActuator(DualShock3Actuators.Right,      5, DualShockActuatorType.DPad));
            buttons.push(new DualShockActuator(DualShock3Actuators.Down,       6, DualShockActuatorType.DPad));
            buttons.push(new DualShockActuator(DualShock3Actuators.Left,       7, DualShockActuatorType.DPad));
            buttons.push(new DualShockActuator(DualShock3Actuators.L2,         8, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock3Actuators.L1,         10, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock3Actuators.R2,         9, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock3Actuators.R1,         11, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock3Actuators.Triangle,   12, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock3Actuators.Circle,     13, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock3Actuators.X,          14, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock3Actuators.Square,     15, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock3Actuators.Ps,         16, DualShockActuatorType.Button));
        }
        return new DualShockMapping(axes, buttons);
    }
}
