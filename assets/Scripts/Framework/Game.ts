import { _decorator, Component, Canvas, Camera } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    @property({type: Camera})
    public uiCamera: Camera|null = null;
    @property({type: Canvas})
    public uiCanvas: Canvas|null = null;
}
