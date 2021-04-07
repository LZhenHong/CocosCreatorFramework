import { _decorator, Component, Canvas, Camera, Constructor, CCString } from 'cc';
import { BaseController } from './Controller/BaseController';
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
    /// 游戏 UI 层级容器
    @property({type: Component, tooltip: 'UI 根节点', displayName: 'UI Root'})
    public uiRoot: Component|null = null;
    @property({type: Component, tooltip: 'Content 的 UI 层级容器', displayName: 'Content UI Container'})
    public contentUIContainer: Component|null = null;
    @property({type: Component, tooltip: 'Popup 的 UI 层级容器', displayName: 'Popup UI Container'})
    public popupUIContainer: Component|null = null;
    @property({type: Component, tooltip: 'Guide 的 UI 层级容器', displayName: 'Guide UI Container'})
    public guideUIContainer: Component|null = null;
    @property({type: Component, tooltip: 'Top 的 UI 层级容器', displayName: 'Top UI Container'})
    public topUIContainer: Component|null = null;

    @property({type: CCString, tooltip: '游戏 View Prefab 所在路径', displayName: 'View Prefab Directory'})
    public viewPrefabDirectory: string = '';

    private _managers: BaseManager[] = [];
    private _controllers: BaseController[] = [];
    private static _instance: GameManager|null = null;

    public static sharedInstance() {
        return this._instance;
    }

    onLoad() {
        GameManager._instance = this;

        this._initAllManagers();
        this._initAllControllers();
    }

    /**
     * 初始化 Game 中所有 Manager
     *
     * @memberof GameManager
     */
    _initAllManagers() {

    }

    _initSingleManager<T extends BaseManager>(clazz: Constructor<T>) {
        if (clazz) {
            const mgr = new clazz();
            mgr.init();
            this._managers.push(mgr);
        }
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

    _initAllControllers() {

    }

    _initSingleController<T extends BaseController>(ctrClazz: Constructor<T>) {
        if (ctrClazz) {
            const ctr = new ctrClazz();
            ctr.init();
            this._controllers.push(ctr);
        }
    }

    getController<T extends BaseController>(ctrClazz: Constructor<T>): T|null {
        if (ctrClazz) {
            for (const controller of this._controllers) {
                if (controller.constructor === ctrClazz) {
                    return controller as T;
                }
            }
        }
        return null;
    }

    /**
     * 启动游戏主逻辑
     *
     * @memberof GameManager
     */
    start() {
        for (const controller of this._controllers) {
            controller.gameStart();
        }
    }
}
