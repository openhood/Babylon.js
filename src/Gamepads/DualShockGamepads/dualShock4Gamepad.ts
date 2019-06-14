import { Gamepad } from "../gamepad";
import { DualShockPad, DualShockActuator, DualShockActuatorType, DualShockMapping } from './dualShockGamepad';

/**
 * Defines supported buttons for DualShock 4 gamepads
 */
export enum DualShock4Actuators {
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
    Share           = "Share",
    Options         = "Options",
    LeftStick       = "LeftStick",
    RightStick      = "RightStick",
    Up              = "Up",
    Down            = "Down",
    Left            = "Left",
    Right           = "Right",
    Ps              = "Ps",
    TouchPad        = "TouchPad"
}

/**
 * Defines a DualShock 4 gamepad
 */
export class DualShock4Pad extends DualShockPad {
    public static matchId(id: string): boolean {
        return id.search(/0?9cc/) !== -1 || id.search(/0?5c4/) !== -1;
    }
    /**
     * Creates a new DualShock4 gamepad object
     * @param id defines the id of this gamepad
     * @param index defines its index
     * @param gamepad defines the internal HTML gamepad object
     */
    constructor(id: string, index: number, gamepad: any) {
        const mapping = DualShock4Pad._buildMapping(gamepad);
        const leftStickAxisX = mapping.getAxisByAlias(DualShock4Actuators.LeftStickAxisX);
        const leftStickAxisY = mapping.getAxisByAlias(DualShock4Actuators.LeftStickAxisY);
        const rightStickAxisX = mapping.getAxisByAlias(DualShock4Actuators.RightStickAxisX);
        const rightStickAxisY = mapping.getAxisByAlias(DualShock4Actuators.RightStickAxisY);
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
        this.type = Gamepad.DUALSHOCK4;
    }

    private static _buildMapping(gamepad: any): DualShockMapping {
        let axes = [];
        let buttons = [];
        if (gamepad.mapping == 'standard') {
            axes.push(new DualShockActuator(DualShock4Actuators.LeftStickAxisX, 0, DualShockActuatorType.Axis));
            axes.push(new DualShockActuator(DualShock4Actuators.LeftStickAxisY, 1, DualShockActuatorType.Axis));
            axes.push(new DualShockActuator(DualShock4Actuators.RightStickAxisX, 2, DualShockActuatorType.Axis));
            axes.push(new DualShockActuator(DualShock4Actuators.RightStickAxisY, 3, DualShockActuatorType.Axis));

            buttons.push(new DualShockActuator(DualShock4Actuators.Circle, 1, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock4Actuators.Square, 2, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock4Actuators.Triangle, 3, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock4Actuators.L1, 4, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock4Actuators.L2, 5, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock4Actuators.R1, 6, DualShockActuatorType.Trigger));
            buttons.push(new DualShockActuator(DualShock4Actuators.R2, 7, DualShockActuatorType.Trigger));
            buttons.push(new DualShockActuator(DualShock4Actuators.Share, 8, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock4Actuators.Options, 9, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock4Actuators.LeftStick, 10, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock4Actuators.RightStick, 11, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock4Actuators.Up, 12, DualShockActuatorType.DPad));
            buttons.push(new DualShockActuator(DualShock4Actuators.Down, 13, DualShockActuatorType.DPad));
            buttons.push(new DualShockActuator(DualShock4Actuators.Left, 14, DualShockActuatorType.DPad));
            buttons.push(new DualShockActuator(DualShock4Actuators.Right, 15, DualShockActuatorType.DPad));
            buttons.push(new DualShockActuator(DualShock4Actuators.Ps, 16, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock4Actuators.TouchPad, 17, DualShockActuatorType.Button));
        } else {
            axes.push(new DualShockActuator(DualShock4Actuators.LeftStickAxisX, 0, DualShockActuatorType.Axis));
            axes.push(new DualShockActuator(DualShock4Actuators.LeftStickAxisY, 1, DualShockActuatorType.Axis));
            axes.push(new DualShockActuator(DualShock4Actuators.RightStickAxisX, 2, DualShockActuatorType.Axis));
            axes.push(new DualShockActuator(DualShock4Actuators.RightStickAxisY, 5, DualShockActuatorType.Axis));

            buttons.push(new DualShockActuator(DualShock4Actuators.X, 1, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock4Actuators.Circle, 2, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock4Actuators.Square, 0, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock4Actuators.Triangle, 3, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock4Actuators.L1, 4, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock4Actuators.L2, 5, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock4Actuators.R1, 6, DualShockActuatorType.Trigger));
            buttons.push(new DualShockActuator(DualShock4Actuators.R2, 7, DualShockActuatorType.Trigger));
            buttons.push(new DualShockActuator(DualShock4Actuators.Share, 8, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock4Actuators.Options, 9, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock4Actuators.LeftStick, 10, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock4Actuators.RightStick, 11, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock4Actuators.Up, 14, DualShockActuatorType.DPad));
            buttons.push(new DualShockActuator(DualShock4Actuators.Right, 17, DualShockActuatorType.DPad));
            buttons.push(new DualShockActuator(DualShock4Actuators.Down, 15, DualShockActuatorType.DPad));
            buttons.push(new DualShockActuator(DualShock4Actuators.Left, 16, DualShockActuatorType.DPad));
            buttons.push(new DualShockActuator(DualShock4Actuators.Ps, 12, DualShockActuatorType.Button));
            buttons.push(new DualShockActuator(DualShock4Actuators.TouchPad, 13, DualShockActuatorType.Button));
        }
        return new DualShockMapping(axes, buttons);
    }
}
