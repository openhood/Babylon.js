import { Gamepad } from "../gamepad";
import { Nullable } from '../../types';
import { Observable } from '../../Misc/observable';

export enum DualShockActuatorType {
    Button,
    DPad,
    Trigger,
    Axis
}

export class DualShockActuator {
    private _alias: string;
    public get alias(): string { return this._alias; }
    private _index: number;
    public get index(): number { return this._index; }
    private _type: DualShockActuatorType;
    public get type(): DualShockActuatorType { return this._type; }
    private _upValue: number; // Value when actuator is released.
    public get upValue(): number { return this._upValue; }
    private _downValue: number; // Value when actuator is pressed.
    public get downValue(): number { return this._downValue; }

    constructor(alias: string, index: number, type: DualShockActuatorType, upValue: number = 0, downValue: number = 1) {
        this._alias = alias;
        this._index = index;
        this._type = type;
        this._upValue = upValue;
        this._downValue = downValue;
    }
}

export type DualShockActuatorButton = DualShockActuator & { type: DualShockActuatorType.Button };
export type DualShockActuatorDPad = DualShockActuator & { type: DualShockActuatorType.DPad };
export type DualShockActuatorTrigger = DualShockActuator & { type: DualShockActuatorType.Trigger };

export class DualShockMapping {
    private _axes: DualShockActuator[];
    private _buttons: DualShockActuator[];
    private _axesByAlias: Map<string, DualShockActuator> = new Map();
    private _axesByIndex: Map<number, DualShockActuator> = new Map();
    private _buttonsByAlias: Map<string, DualShockActuator> = new Map();
    private _buttonsByIndex: Map<number, DualShockActuator> = new Map();

    public get axes(): DualShockActuator[] {
        return this._axes;
    }
    public get buttons(): DualShockActuator[] {
        return this._buttons;
    }
    public getAxisByAlias(alias: string): Nullable<DualShockActuator> {
        return this._axesByAlias.get(alias) || null;
    }
    public getAxisByIndex(index: number): Nullable<DualShockActuator> {
        return this._axesByIndex.get(index) || null;
    }
    public getButtonByAlias(alias: string): Nullable<DualShockActuator> {
        return this._buttonsByAlias.get(alias) || null;
    }
    public getButtonByIndex(index: number): Nullable<DualShockActuator> {
        return this._buttonsByIndex.get(index) || null;
    }

    constructor(axes: DualShockActuator[], buttons: DualShockActuator[]) {
        this._axes = axes;
        this._buttons = buttons;
        axes.forEach((axis) => {
            this._axesByAlias.set(axis.alias, axis);
            this._axesByIndex.set(axis.index, axis);
        });
        buttons.forEach((button) => {
            this._buttonsByAlias.set(button.alias, button);
            this._buttonsByIndex.set(button.index, button);
        });
    }
}

export class DualShockPad extends Gamepad {

    public static matchId(id: string): boolean {
        return id.search(/0?54c/) !== -1;
    }

    protected _mapping: DualShockMapping;
    private _actuatorValues: Map<DualShockActuator, number> = new Map();

    /** Observable raised when a button is pressed */
    public onButtonDownObservable = new Observable<DualShockActuatorButton>();
    /** Observable raised when a button is released */
    public onButtonUpObservable = new Observable<DualShockActuatorButton>();
    /** Observable raised when a pad is pressed */
    public onPadDownObservable = new Observable<DualShockActuatorDPad>();
    /** Observable raised when a pad is released */
    public onPadUpObservable = new Observable<DualShockActuatorDPad>();
    /** Observable raised when a trigger value change */
    public onTriggerChangedObservable = new Observable<{actuator: DualShockActuatorTrigger, value: number}>();

    private _onbuttondown: (buttonPressed: DualShockActuatorButton) => void;
    private _onbuttonup: (buttonReleased: DualShockActuatorButton) => void;
    private _ondpaddown: (dPadPressed: DualShockActuatorDPad) => void;
    private _ondpadup: (dPadReleased: DualShockActuatorDPad) => void;
    private _ontriggerchanged: (triggerChanged: DualShockActuatorTrigger, newValue: number) => void;

    public axisActuator(aliasOrIndex: string | number): Nullable<DualShockActuator>{
        let actuator: Nullable<DualShockActuator> = null;
        if (typeof aliasOrIndex == 'string') {
            actuator = this._mapping.getAxisByAlias(aliasOrIndex);
            if (!actuator) {
                throw new Error(`Unknown axis alias ${aliasOrIndex}`);
            }
        } else if (typeof aliasOrIndex == 'number') {
            actuator = this._mapping.getAxisByIndex(aliasOrIndex);
            if (!actuator) {
                throw new Error(`Unknown axis index ${aliasOrIndex}`);
            }
        }
        return actuator;
    }

    public buttonActuator(aliasOrIndex: string | number): Nullable<DualShockActuator>{
        let actuator: Nullable<DualShockActuator> = null;
        if (typeof aliasOrIndex == 'string') {
            actuator = this._mapping.getButtonByAlias(aliasOrIndex);
            if (!actuator) {
                throw new Error(`Unknown button alias ${aliasOrIndex}`);
            }
        } else if (typeof aliasOrIndex == 'number') {
            actuator = this._mapping.getButtonByIndex(aliasOrIndex);
            if (!actuator) {
                throw new Error(`Unknown button index ${aliasOrIndex}`);
            }
        }
        return actuator;
    }

    public actuatorValue(actuator: DualShockActuator): number {
        return this._actuatorValues.get(actuator) || actuator.upValue;
    }

    private setActuatorValue(actuator: DualShockActuator, newValue: number): void {
        const currentValue = this._actuatorValues.get(actuator) || actuator.upValue;
        this._actuatorValues.set(
            actuator,
            this._setActuatorValue(actuator, newValue, currentValue)
        );
    }

    private _setActuatorValue(actuator: DualShockActuator, newValue: number, currentValue: number): number {
        if (newValue !== currentValue) {
            if (actuator.type == DualShockActuatorType.Trigger) {
                if (this._ontriggerchanged) {
                    this._ontriggerchanged(<DualShockActuatorTrigger>actuator, newValue);
                }
                this.onTriggerChangedObservable.notifyObservers({actuator: <DualShockActuatorTrigger>actuator, value: newValue});
            } else {
                if (newValue === actuator.downValue) {
                    if (actuator.type == DualShockActuatorType.Button) {
                        if (this._onbuttondown) {
                            this._onbuttondown(<DualShockActuatorButton>actuator);
                        }
                        this.onButtonDownObservable.notifyObservers(<DualShockActuatorButton>actuator);
                    } else if (actuator.type == DualShockActuatorType.DPad) {
                        if (this._ondpaddown) {
                            this._ondpaddown(<DualShockActuatorDPad>actuator);
                        }
                        this.onPadDownObservable.notifyObservers(<DualShockActuatorDPad>actuator);
                    }
                }
                if (newValue === actuator.upValue) {
                    if (actuator.type == DualShockActuatorType.Button) {
                        if (this._onbuttonup) {
                            this._onbuttonup(<DualShockActuatorButton>actuator);
                        }
                        this.onButtonUpObservable.notifyObservers(<DualShockActuatorButton>actuator);
                    } else if (actuator.type == DualShockActuatorType.DPad) {
                        if (this._ondpadup) {
                            this._ondpadup(<DualShockActuatorDPad>actuator);
                        }
                        this.onPadUpObservable.notifyObservers(<DualShockActuatorDPad>actuator);
                    }
                }
            }
        }
        return newValue;
    }

    /**
    * Defines the callback to call when a button is pressed
    * @param callback defines the callback to use
    */
    public onbuttondown(callback: (buttonPressed: DualShockActuator & { type: DualShockActuatorType.Button }) => void) {
        this._onbuttondown = callback;
    }

    /**
     * Defines the callback to call when a button is released
     * @param callback defines the callback to use
     */
    public onbuttonup(callback: (buttonReleased: DualShockActuator & { type: DualShockActuatorType.Button }) => void) {
        this._onbuttonup = callback;
    }

    /**
     * Defines the callback to call when a pad is pressed
     * @param callback defines the callback to use
     */
    public ondpaddown(callback: (dPadPressed: DualShockActuator & {type: DualShockActuatorType.DPad}) => void) {
        this._ondpaddown = callback;
    }

    /**
     * Defines the callback to call when a pad is released
     * @param callback defines the callback to use
     */
    public ondpadup(callback: (dPadReleased: DualShockActuatorDPad) => void) {
        this._ondpadup = callback;
    }

    public update() {
        super.update();
        this._mapping.buttons.forEach((actuator) => {
            this.setActuatorValue(
                actuator,
                this.browserGamepad.buttons[actuator.index].value
            );
        });
    }

    /**
     * Disposes the gamepad
     */
    public dispose() {
        super.dispose();
        this._actuatorValues.clear();
        this.onButtonDownObservable.clear();
        this.onButtonUpObservable.clear();
        this.onPadDownObservable.clear();
        this.onPadUpObservable.clear();
    }
}
