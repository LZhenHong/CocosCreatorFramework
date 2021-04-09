import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TouchListener')
export class TouchListener extends Component {
    @property({tooltip: '是否阻止触摸事件传递', displayName: 'Swallow Touch'})
    public swallowTouch = false;

    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
    }

    _onTouchStart(event: Event) {

    }

    _onTouchMove(event: Event) {

    }

    _onTouchEnd(event: Event) {

    }

    _onTouchCancel(event: Event) {

    }

}
