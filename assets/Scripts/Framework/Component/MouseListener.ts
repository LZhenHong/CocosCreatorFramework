import { _decorator, Component, Node} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MouseListener')
export class MouseListener extends Component {

    onLoad() {
        this.node.on(Node.EventType.MOUSE_UP, this._onMouseUp, this);
        this.node.on(Node.EventType.MOUSE_DOWN, this._onMouseDown, this);
        this.node.on(Node.EventType.MOUSE_MOVE, this._onMouseMove, this);
        this.node.on(Node.EventType.MOUSE_WHEEL, this._onMouseWheel, this);
        this.node.on(Node.EventType.MOUSE_ENTER, this._onMouseEnter, this);
        this.node.on(Node.EventType.MOUSE_LEAVE, this._onMouseLeave, this);
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
