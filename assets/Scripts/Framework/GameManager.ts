import { _decorator, Component, Canvas, Camera, js } from 'cc';
import { TimeManager } from './TimerManager';
import { BaseManager } from './Utility/BaseManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property({type: Camera, tooltip: '游戏 UI 相机', displayName: 'UI Camera'})
    public uiCamera: Camera|null = null;
    @property({type: Canvas, tooltip: '游戏 UI 画布', displayName: 'UI Canvas'})
    public uiCanvas: Canvas|null = null;

    private _managers: BaseManager[] = [];

    onLoad() {
        this._initAllManagers();
    }

    _initAllManagers() {
        this._initSingleManager(typeof TimeManager);
    }

    _initSingleManager(clazz: any) {

    }

    // getManager<T>(): T {
    // }
}

