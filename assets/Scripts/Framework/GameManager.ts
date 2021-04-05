import { _decorator, Component, Canvas, Camera, Constructor } from 'cc';
import { BaseManager } from './Utility/BaseManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property({type: Camera, tooltip: '游戏 UI 相机', displayName: 'UI Camera'})
    public uiCamera: Camera|null = null;
    @property({type: Canvas, tooltip: '游戏 UI 画布', displayName: 'UI Canvas'})
    public uiCanvas: Canvas|null = null;

    private _managers: BaseManager[] = [];
    private _instance: GameManager|null = null;

    get sharedInstance() {
        return this._instance;
    }

    onLoad() {
        this._instance = this;

        this._initAllManagers();
    }

    _initAllManagers() {
    }

    _initSingleManager<T extends BaseManager>(clazz: Constructor<T>) {
        let mgr = new clazz();
        mgr.init();
        this._managers.push(mgr);
    }

    getManager<T extends BaseManager>(mgrClazz: Constructor<T>): T|null {
        if (mgrClazz) {
            for (let manager of this._managers) {
                if (manager.constructor === mgrClazz) {
                    return manager as T;
                }
            }
        }
        return null;
    }
}
