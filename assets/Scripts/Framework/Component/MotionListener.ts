import { _decorator, Component, systemEvent, SystemEventType, EventAcceleration } from "cc";
const { ccclass, menu } = _decorator;

@ccclass("MotionListener")
@menu('Framework/MotionListener')
export class MotionListener extends Component {
    onLoad() {
        systemEvent.setAccelerometerEnabled(true);
        systemEvent.on(SystemEventType.DEVICEMOTION, this._onDeviceMotionEvent, this);
    }

    onDestroy() {
        systemEvent.off(SystemEventType.DEVICEMOTION, this._onDeviceMotionEvent, this);
    }

    private _onDeviceMotionEvent(event: EventAcceleration) {
    }
}
