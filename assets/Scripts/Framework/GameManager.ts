import { _decorator, Component, Canvas, Camera } from 'cc';
import { TimeManager } from './TimerManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property({type: Camera})
    public uiCamera: Camera|null = null;
    @property({type: Canvas})
    public uiCanvas: Canvas|null = null;

    onLoad() {
        this._initAllManagers();
    }

    _initAllManagers() {
        TimeManager.sharedInstance().initWithGameRoot(this.node);
    }
}
