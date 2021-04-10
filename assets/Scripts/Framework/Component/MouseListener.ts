import { _decorator, Component, Node, EventHandler} from 'cc';
const { ccclass, property, menu } = _decorator;

@ccclass('MouseListener')
@menu('Framework/MouseListener')
export class MouseListener extends Component {
    @property({tooltip: '是否将事件注册在捕获阶段', displayName: 'Capture Touch'})
    public captureTouch = false;
    @property({tooltip: '是否响应鼠标事件', displayName: 'Receive Mouse Event'})
    public receiveMouseEvent = false;
    @property({type: [EventHandler], tooltip: '处理鼠标事件', displayName: 'Mouse Event Handlers'})
    public mouseHandlers: (EventHandler|null)[] = [];

    onLoad() {
        this.node.on(Node.EventType.MOUSE_UP, this._onMouseUp, this, this.captureTouch);
        this.node.on(Node.EventType.MOUSE_DOWN, this._onMouseDown, this, this.captureTouch);
        this.node.on(Node.EventType.MOUSE_MOVE, this._onMouseMove, this, this.captureTouch);
        this.node.on(Node.EventType.MOUSE_WHEEL, this._onMouseWheel, this, this.captureTouch);
        this.node.on(Node.EventType.MOUSE_ENTER, this._onMouseEnter, this, this.captureTouch);
        this.node.on(Node.EventType.MOUSE_LEAVE, this._onMouseLeave, this, this.captureTouch);
    }

    onDestroy() {
        this.node.off(Node.EventType.MOUSE_UP, this._onMouseUp, this, this.captureTouch);
        this.node.off(Node.EventType.MOUSE_DOWN, this._onMouseDown, this, this.captureTouch);
        this.node.off(Node.EventType.MOUSE_MOVE, this._onMouseMove, this, this.captureTouch);
        this.node.off(Node.EventType.MOUSE_WHEEL, this._onMouseWheel, this, this.captureTouch);
        this.node.off(Node.EventType.MOUSE_ENTER, this._onMouseEnter, this, this.captureTouch);
        this.node.off(Node.EventType.MOUSE_LEAVE, this._onMouseLeave, this, this.captureTouch);
    }

    _onMouseUp(event: Event) {

    }

    _onMouseDown(event: Event) {

    }

    _onMouseMove(event: Event) {

    }

    _onMouseWheel(event: Event) {

    }

    _onMouseEnter(event: Event) {

    }

    _onMouseLeave(event: Event) {

    }

}
