import { _decorator, Component, systemEvent, SystemEventType, EventKeyboard } from "cc";
const { ccclass, menu } = _decorator;

@ccclass("KeyboardListener")
@menu('Framework/KeyboardListener')
export class KeyboardListener extends Component {
    onLoad() {
        systemEvent.on(SystemEventType.KEY_DOWN, this._onKeyDown, this);
        systemEvent.on(SystemEventType.KEY_UP, this._onKeyUp, this);
    }

    onDestroy() {
        systemEvent.off(SystemEventType.KEY_DOWN, this._onKeyDown, this);
        systemEvent.off(SystemEventType.KEY_UP, this._onKeyUp, this);
    }

    private _onKeyDown(event: EventKeyboard) {
    }

    private _onKeyUp(event: EventKeyboard) {
    }
}
