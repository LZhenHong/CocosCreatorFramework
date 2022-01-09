import { Constructor } from './utility/GameUtility';
import { ViewAnimationEnum, ViewLayerEnum } from './const/Enum';

/// Manager
import BaseManager from './utility/BaseManager';
import AssetsManager from './managers/AssetsManager';
import PreloadManager from './managers/PreloadManager';
import NetworkManager from './managers/NetworkManager';
import TimerManager from './managers/TimerManager';
import AudioManager from './managers/AudioManager';
import RecyclePoolManager from './managers/RecyclePoolManager';
import MaskManager from './managers/MaskManager';
import PrefManager from './managers/PrefManager';
import JSBManager from './managers/JSBManager';
import SDKConfig from './sdk/SDKConfig';
import SDKManager from './managers/SDKManager';
import EventManager from './managers/EventManager';
import ViewManager from './view/ViewManager';

import BaseController from './controller/BaseController';
import BaseViewController from './controller/BaseViewController';
import BaseView from './view/BaseView';

import MainUI from './MainUI';

const { ccclass, property, disallowMultiple, menu } = cc._decorator;

/**
 * 游戏的管理类，挂载在游戏的根节点下
 *
 * @export
 * @class GameManager
 * @extends {cc.Component}
 */
@ccclass
@disallowMultiple
@menu('Framework/GameManager')
export default class GameManager extends cc.Component {
    @property({ tooltip: '游戏 View Prefab 所在路径', displayName: 'View Prefab Directory' })
    public viewPrefabDirectory: string = '';

    @property({ type: [SDKConfig], tooltip: 'SDK 配置', displayName: 'SDK Config' })
    public sdkConfigs: SDKConfig[] = [];

    @property({ tooltip: '是否开启多点触摸', displayName: 'Enable Mutiple Touch' })
    public enableMutipleTouch = true;

    @property({ tooltip: '设置游戏帧率', displayName: 'Game Frame Rate' })
    public gameFrameRate = 60;

    @property({ tooltip: '是否强制开启动态合图', displayName: 'Enable Force Auto Atlas' })
    public enableForceAutoAtlas = false;

    public mainUI: MainUI = null;

    private _managers: BaseManager[] = [];
    private _controllers: BaseController[] = [];
    private static _instance: GameManager | null = null;

    public static get instance() {
        return this._instance;
    }

    constructor() {
        super();

        GameManager._instance = this;
    }

    onLoad() {
        // 和 Canvas 同一层的才是 Root
        cc.game.addPersistRootNode(this.node);
        /// 设置游戏帧率
        cc.game.setFrameRate(this.gameFrameRate);
        /// 是否多点触摸开关
        cc.macro.ENABLE_MULTI_TOUCH = this.enableMutipleTouch;
        if (this.enableForceAutoAtlas) {
            cc.macro.CLEANUP_IMAGE_CACHE = false;
            cc.dynamicAtlasManager.enabled = true;
        }

        this._initAllManagers();
        this._setupManagers();

        this._initAllControllers();
    }

    private _setupManagers() {
        /// 设置计时器
        this.getManager(TimerManager)?.setupTimer(this);
        /// 配置 SDK
        let channelSdkConfig = this.channelSDKConfig();
        if (channelSdkConfig) {
            this.getManager(SDKManager)?.setupWithSDKConfig(this.channelSDKConfig());
        }
    }

    private channelSDKConfig(): SDKConfig {
        let channel = this.getManager(JSBManager).getChannel();
        let sdkConfig = this.sdkConfigs.find(config => config.channelString === channel);
        return sdkConfig;
    }

    public setUserId(userId: string) {
        this.getManager(SDKManager)?.setUserId(userId);
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
        /// 预加载管理器
        this._initSingleManager(PreloadManager);
        /// 网络请求管理器
        this._initSingleManager(NetworkManager);
        /// 计时管理器
        this._initSingleManager(TimerManager);
        /// 音频管理器
        this._initSingleManager(AudioManager);
        /// View 管理器
        this._initSingleManager(ViewManager);
        /// 回收池管理器
        this._initSingleManager(RecyclePoolManager);
        /// 遮罩管理器
        this._initSingleManager(MaskManager);
        /// 存储管理器
        this._initSingleManager(PrefManager);
        /// jsb 管理器
        this._initSingleManager(JSBManager);
        /// SDK 管理器
        this._initSingleManager(SDKManager);
        /// 事件管理器
        this._initSingleManager(EventManager);
    }

    _initSingleManager<T extends BaseManager>(clazz: Constructor<T>) {
        if (clazz) {
            let mgr = new clazz();
            mgr.init(this);
            this._managers.push(mgr);
        }
    }

    static getManager<T extends BaseManager>(mgrClazz: Constructor<T>): T | null {
        if (this.instance) {
            return this.instance.getManager(mgrClazz);
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
        return null;
    }

    onGameStart() {
        this._controllers.forEach((controller) => {
            controller.gameStart();
        });
    }

    /**
     * 初始化 Game 中所有 Controller
     *
     * @memberof GameManager
     */
    _initAllControllers() { }

    _initSingleController<T extends BaseController>(ctrClazz: Constructor<T>) {
        if (ctrClazz) {
            let ctr = new ctrClazz();
            ctr.init();
            this._controllers.push(ctr);

            if (ctr instanceof BaseViewController) {
                let viewCtr = ctr as BaseViewController<BaseView>;
                viewCtr.gm_init(this.getManager(ViewManager));
            }
        }
    }

    static getController<T extends BaseController>(ctrClazz: Constructor<T>): T | null {
        if (this.instance) {
            return this.instance!.getController(ctrClazz);
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
        return null;
    }

    public viewContainerForLayer(layer: ViewLayerEnum): cc.Node {
        if (!this.mainUI) {
            return cc.director.getScene();
        }

        switch (layer) {
            case ViewLayerEnum.Top:
                return this.mainUI.topUIContainer;
            case ViewLayerEnum.Popup:
                return this.mainUI.popupUIContainer;
            case ViewLayerEnum.Guide:
                return this.mainUI.guideUIContainer;
            case ViewLayerEnum.Content:
            default:
                return this.mainUI.contentUIContainer;
        }
    }

    public viewAnimatorForOption(animation: ViewAnimationEnum): string {
        let viewAnimatorName = `View${ViewAnimationEnum[animation]}Animator`;
        return viewAnimatorName;
    }

}
