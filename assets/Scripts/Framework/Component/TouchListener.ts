import { _decorator, Component, Node, EventHandler } from 'cc';
const { ccclass, property, menu } = _decorator;

/**
 * 触摸事件在移动平台和桌面平台都会触发，开发者可以更好的在桌面平台调试，只需要监听触摸事件即可同时响应移动平台的触摸事件和桌面端的鼠标事件
 * 触摸事件支持多点触摸，每个触点都会发送一次事件给事件监听器
 *
 * @export
 * @class TouchListener
 * @extends {Component}
 */
@ccclass('TouchListener')
@menu('Framework/TouchListener')
export class TouchListener extends Component {
    @property({ tooltip: '是否阻止触摸事件传递', displayName: 'Swallow Touch' })
    public swallowTouch = false;
    @property({ tooltip: '是否将事件注册在捕获阶段', displayName: 'Capture Touch' })
    public captureTouch = false;
    @property({ type: [EventHandler], tooltip: '处理触摸事件', displayName: 'Touch Event Handlers' })
    public touchHandlers: (EventHandler | null)[] = [];

    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this._onTouchStart, this, this.captureTouch);
        this.node.on(Node.EventType.TOUCH_MOVE, this._onTouchMove, this, this.captureTouch);
        this.node.on(Node.EventType.TOUCH_END, this._onTouchEnd, this, this.captureTouch);
        this.node.on(Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this, this.captureTouch);
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_START, this._onTouchStart, this, this.captureTouch);
        this.node.off(Node.EventType.TOUCH_MOVE, this._onTouchMove, this, this.captureTouch);
        this.node.off(Node.EventType.TOUCH_END, this._onTouchEnd, this, this.captureTouch);
        this.node.off(Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this, this.captureTouch);
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
