import { _decorator, Component, Canvas, Camera, Constructor, CCString } from 'cc';
import { BaseManager } from './Utility/BaseManager';
const { ccclass, property } = _decorator;

/**
 * 游戏的管理类，挂载在游戏的根节点下
 *
 * @export
 * @class GameManager
 * @extends {Component}
 */
@ccclass('GameManager')
export class GameManager extends Component {
    @property({type: Camera, tooltip: '游戏 UI 相机', displayName: 'UI Camera'})
    public uiCamera: Camera|null = null;
    @property({type: Canvas, tooltip: '游戏 UI 画布', displayName: 'UI Canvas'})
    public uiCanvas: Canvas|null = null;
    @property({type: CCString, tooltip: '游戏 View Prefab 所在路径', displayName: 'View Prefab Directory'})
    public viewPrefabDirectory: string = '';

    private _managers: BaseManager[] = [];
    private static _instance: GameManager|null = null;

    public static sharedInstance() {
        return this._instance;
    }

    onLoad() {
        GameManager._instance = this;

        this._initAllManagers();
    }

    /**
     * 初始化 Game 中所有 Manager
     *
     * @memberof GameManager
     */
    _initAllManagers() {

    }

    _initSingleManager<T extends BaseManager>(clazz: Constructor<T>) {
        const mgr = new clazz();
        mgr.init();
        this._managers.push(mgr);
    }

    getManager<T extends BaseManager>(mgrClazz: Constructor<T>): T|null {
        if (mgrClazz) {
            for (const manager of this._managers) {
                if (manager.constructor === mgrClazz) {
                    return manager as T;
                }
            }
        }
        return null;
    }
}
