import { _decorator, Component, systemEvent, SystemEvent, EventKeyboard } from "cc";
const { ccclass, menu } = _decorator;

@ccclass("KeyboardListener")
@menu('Framework/KeyboardListener')
export class KeyboardListener extends Component {
    onLoad() {
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this);
        systemEvent.on(SystemEvent.EventType.KEY_UP, this._onKeyUp, this);
    }

    onDestroy() {
        systemEvent.off(SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this);
        systemEvent.off(SystemEvent.EventType.KEY_UP, this._onKeyUp, this);
    }

    private _onKeyDown(event: EventKeyboard) {
    }

    private _onKeyUp(event: EventKeyboard) {
    }
}
