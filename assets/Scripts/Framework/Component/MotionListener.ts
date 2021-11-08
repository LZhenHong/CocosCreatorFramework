import { _decorator, Component, systemEvent, SystemEvent, EventAcceleration } from "cc";
const { ccclass, menu } = _decorator;

@ccclass("MotionListener")
@menu('Framework/MotionListener')
export class MotionListener extends Component {
    onLoad() {
        systemEvent.setAccelerometerEnabled(true);
        systemEvent.on(SystemEvent.EventType.DEVICEMOTION, this._onDeviceMotionEvent, this);
    }

    onDestroy() {
        systemEvent.off(SystemEvent.EventType.DEVICEMOTION, this._onDeviceMotionEvent, this);
    }

    private _onDeviceMotionEvent(event: EventAcceleration) {
    }
}
