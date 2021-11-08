import { _decorator, Component, Canvas, Camera, Constructor, Node, js, game, macro } from 'cc';
import { DEV } from 'cc/env';

/// Manager
import { BaseManager } from './Utility/BaseManager';
import { AssetsManager } from './Asset/AssetsManager';
import { AudioManager } from './AudioManager';
import { NetworkManager } from './NetworkManager';
import { TimerManager } from './TimerManager';
import { PhysicsSystemManager } from './PhysicsSystemManager';

/// Controller
import { BaseController } from './Controller/BaseController';
import { StartViewController } from '../Game/StartViewController';

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
    @property({ type: Camera, tooltip: '游戏 UI 相机', displayName: 'UI Camera' })
    public uiCamera: Camera | null = null;
    @property({ type: Canvas, tooltip: '游戏 UI 画布', displayName: 'UI Canvas' })
    public uiCanvas: Canvas | null = null;

    /// 游戏 UI 层级容器
    @property({ type: Node, tooltip: 'UI 根节点', displayName: 'UI Root' })
    public uiRoot: Node | null = null;
    @property({ type: Node, tooltip: 'Content 的 UI 层级容器', displayName: 'Content UI Container' })
    public contentUIContainer: Node | null = null;
    @property({ type: Node, tooltip: 'Popup 的 UI 层级容器', displayName: 'Popup UI Container' })
    public popupUIContainer: Node | null = null;
    @property({ type: Node, tooltip: 'Guide 的 UI 层级容器', displayName: 'Guide UI Container' })
    public guideUIContainer: Node | null = null;
    @property({ type: Node, tooltip: 'Top 的 UI 层级容器', displayName: 'Top UI Container' })
    public topUIContainer: Node | null = null;

    @property({ tooltip: '游戏 View Prefab 所在路径', displayName: 'View Prefab Directory' })
    public viewPrefabDirectory: string = '';

    @property({ tooltip: '是否开启多点触摸', displayName: 'Enable Mutiple Touch' })
    public enableMutipleTouch = true;

    @property({ tooltip: '设置游戏帧率', displayName: 'Game Frame Rate' })
    public gameFrameRate = 60;

    private _managers: BaseManager[] = [];
    private _controllers: BaseController[] = [];
    private static _instance: GameManager | null = null;

    public static sharedInstance() {
        return this._instance;
    }

    constructor() {
        super();

        GameManager._instance = this;
    }

    onLoad() {
        /// 设置常驻节点
        game.addPersistRootNode(this.node);
        /// 设置游戏帧率
        game.setFrameRate(this.gameFrameRate);
        /// 是否多点触摸开关
        macro.ENABLE_MULTI_TOUCH = this.enableMutipleTouch;

        this._initAllManagers();
        this._initAllControllers();
    }

    start() {
        /// 设置计时器
        this.getManager(TimerManager)?.setupTimer(this);
    }

    onEnable() {

    }

    onDisable() {

    }

    update(deltaTime: number) {
        this._managers.forEach((mgr) => {
            mgr.update(deltaTime);
        });
    }

    lateUpdate(deltaTime: number) {
        this._managers.forEach((mgr) => {
            mgr.lateUpdate(deltaTime);
        });
    }

    /**
     * 初始化 Game 中所有 Manager
     *
     * @memberof GameManager
     */
    _initAllManagers() {
        /// 资源管理器
        this._initSingleManager(AssetsManager);
        /// 音频管理器
        this._initSingleManager(AudioManager);
        /// 网络管理器
        this._initSingleManager(NetworkManager);
        /// 计时管理器
        this._initSingleManager(TimerManager);
        /// 2D 物理引擎管理器
        this._initSingleManager(PhysicsSystemManager);
    }

    _initSingleManager<T extends BaseManager>(clazz: Constructor<T>) {
        if (clazz) {
            let mgr = new clazz();
            mgr.init();
            this._managers.push(mgr);
        }
    }

    static getManager<T extends BaseManager>(mgrClazz: Constructor<T>): T | null {
        if (this.sharedInstance()) {
            return this.sharedInstance()!.getManager(mgrClazz);
        }
        return null;
    }

    getManager<T extends BaseManager>(mgrClazz: Constructor<T>): T | null {
        if (mgrClazz) {
            for (let manager of this._managers) {
                if (manager.constructor === mgrClazz) {
                    return manager as T;
                }
            }
        }
        if (DEV) {
            console.error('Cant find manager: ' + js.getClassName(mgrClazz));
        }
        return null;
    }

    /**
     * 初始化 Game 中所有 Controller
     *
     * @memberof GameManager
     */
    _initAllControllers() {
        this._initSingleController(StartViewController);
    }

    _initSingleController<T extends BaseController>(ctrClazz: Constructor<T>) {
        if (ctrClazz) {
            let ctr = new ctrClazz();
            ctr.init();
            this._controllers.push(ctr);
        }
    }

    static getController<T extends BaseController>(ctrClazz: Constructor<T>): T | null {
        if (this.sharedInstance()) {
            return this.sharedInstance()!.getController(ctrClazz);
        }
        return null;
    }

    getController<T extends BaseController>(ctrClazz: Constructor<T>): T | null {
        if (ctrClazz) {
            for (let controller of this._controllers) {
                if (controller.constructor === ctrClazz) {
                    return controller as T;
                }
            }
        }
        if (DEV) {
            console.error('Cant find controller: ' + js.getClassName(ctrClazz));
        }
        return null;
    }

    /**
     * 启动游戏主逻辑
     *
     * @memberof GameManager
     */
    gameStart() {
        for (let controller of this._controllers) {
            controller.gameStart();
        }
    }
}
