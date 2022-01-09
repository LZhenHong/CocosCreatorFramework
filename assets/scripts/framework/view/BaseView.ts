import GameManager from '../GameManager';
import { Constructor, GameUtility } from '../utility/GameUtility';
import AssetHolder from '../component/AssetHolder';
import NodeHolder from '../component/NodeHolder';
import ViewOptions from '../component/ViewOptions';
import { ActiveType, ButtonClickEvent } from '../const/Const';
import ViewManager from './ViewManager';
import SpriteHolder from '../component/SpriteHolder';
import ViewDefaultAnimator from '../view_animator/ViewDefaultAnimator';
import EventManager from '../managers/EventManager';
import TimerManager from '../managers/TimerManager';
const { ccclass } = cc._decorator;

/**
 * 基础的 View 类
 *
 * @warning 子类需要声明 ccclass 并表明子类名称
 * @export
 * @abstract
 * @class BaseView
 */
@ccclass
export default abstract class BaseView {
    public node: cc.Node | null = null;
    protected nodeHolder: NodeHolder | null = null;
    protected assetHolder: AssetHolder | null = null;
    protected spriteHolder: SpriteHolder | null = null;
    public viewOptions: ViewOptions | null = null;
    public vm_maskHandler: number = 0;
    public vm_viewAnimator: ViewDefaultAnimator | null = null;

    private _buttonEventListeners: Map<cc.Button, Function> = new Map<cc.Button, Function>();
    private _eventListeners: Map<string, number> = new Map();
    private _timerHandles: Array<number> = new Array();
    private _viewPrefabName: string = '';

    public getCall ?: Function;

    get eventManager(): EventManager {
        return GameManager.getManager(EventManager);
    }

    get timerManager(): TimerManager {
        return GameManager.getManager(TimerManager);
    }

    constructor() {
        this._clazzNameToViewPrefab();
    }

    /**
     * 初始化 View
     * 只能被 ViewManager 调用
     *
     * @public
     * @param {Node} node View 对象 Node
     * @memberof BaseView
     */
    public vm_init(node: cc.Node) {
        this.node = node;
        this.nodeHolder = this.node.getComponent(NodeHolder);
        this.assetHolder = this.node.getComponent(AssetHolder);
        this.spriteHolder = this.node.getComponent(SpriteHolder);
        this.viewOptions = this.node.getComponent(ViewOptions);

        this._buttonEventListeners.clear();
        this._eventListeners.clear();
        this._timerHandles = [];

        this._initRest();
        this.registerDefaultCloseButton();

        this.onInit();
    }

    private _initRest() {
        if (this.isValid()) {
            this.node!.on(ActiveType.Active, this.onActive, this);
            this.node!.on(ActiveType.Inactive, this.onInactive, this);
        }
    }

    /**
     * 从 View 的类名推导出 Prefab 的名称
     * @warning Prefab 的命名一定要遵守这里的规则，否则不能正确将 View 绑定到对应的 Prefab 上
     * @example ExampleView 对应的 Prefab 名称就是 example_view
     * @private
     * @memberof BaseView
     */
    private _clazzNameToViewPrefab() {
        let clazzName = cc.js.getClassName(this);
        this._viewPrefabName = GameUtility.camelCaseToUnderScore(clazzName);
    }

    /**
     * 获取 View 对应的 Prefab 路径
     *
     * @return {*}
     * @memberof BaseView
     */
    get viewPrefabPath(): string {
        let path = GameManager.instance?.viewPrefabDirectory + this._viewPrefabName;
        return path;
    }

    /**
     * 销毁 View
     * 只能被 ViewManager 调用
     * @public
     * @memberof BaseView
     */
    public vm_destroy() {
        console.log(`Destroy view: ${cc.js.getClassName(this)}`);

        this._$removeButtonListeners();
        this._$removeEventListeners();
        this._$cancelTimers();

        /// 取消 Active 监听
        this.node?.off(ActiveType.Active, this.onActive, this);
        this.node?.off(ActiveType.Inactive, this.onInactive, this);

        this.onDestroy();

        this.node.destroy();
    }

    /**
     * 获取 NodeHolder 引用的组件
     *
     * @protected
     * @template T Component 组件类型
     * @param {string} name 引用的名称
     * @returns
     * @memberof BaseView
     */
    protected getComponentWithName<T extends cc.Component>(name: string, componentClazz: Constructor<T>): T | null {
        if (this.nodeHolder) {
            return this.nodeHolder.getComponentWithName(name, componentClazz);
        }
        return null;
    }

    /**
     * 获取 NodeHolder 引用的节点
     *
     * @protected
     * @param {string} name
     * @returns {(cc.Node | null)}
     * @memberof BaseView
     */
    protected getNodeWithName(name: string): cc.Node | null {
        if (this.nodeHolder) {
            return this.nodeHolder.getNodeWithName(name);
        }
        return null;
    }

    /**
     * 获取 AssetHolder 的引用
     *
     * @protected
     * @template T Asset 的引用类型
     * @param {string} name 引用的名称
     * @returns
     * @memberof BaseView
     */
    protected getAssetWithName<T extends cc.Asset>(name: string): T | null {
        if (this.assetHolder) {
            return this.assetHolder.getAssetWithName<T>(name);
        }
        return null;
    }

    /**
     * 获取 SpriteHolder 的引用
     *
     * @protected
     * @param {string} name
     * @returns {(cc.SpriteFrame | null)}
     * @memberof BaseView
     */
    protected getSpriteFrameWithName(name: string): cc.SpriteFrame | null {
        if (this.spriteHolder) {
            return this.spriteHolder.getSpriteWithName(name);
        }
        return null;
    }

    /**
     * 给 Button 添加点击监听，无需在 Destroy 时移除监听
     *
     * @protected
     * @param {Button} btn Button 按钮
     * @param {Function} callback 监听回调
     * @memberof BaseView
     */
    protected addClickEventListener(btn: cc.Button | null, callback: Function) {
        if (!btn) {
            return;
        }

        btn.node.on(ButtonClickEvent, callback, this);
        this._buttonEventListeners.set(btn, callback);
    }

    /**
     * 移除 Button 的点击监听
     *
     * @protected
     * @param {Button} btn Button 按钮
     * @param {Function} callback 监听回调
     * @memberof BaseView
     */
    protected removeClickEventListener(btn: cc.Button, callback: Function) {
        btn.node.off(ButtonClickEvent, callback, this);
        this._buttonEventListeners.delete(btn);
    }

    /**
     * 添加事件监听
     *
     * @protected
     * @param {string} eventName
     * @param {Function} callback
     * @memberof BaseView
     */
    protected addEventListener(eventName: string, callback: (args?: any) => void) {
        if (this._eventListeners.has(eventName)) {
            this.removeEventListner(eventName);
        }

        let handler = this.eventManager.addListener(eventName, callback, this);
        this._eventListeners.set(eventName, handler);
    }

    /**
     * 移除事件监听
     *
     * @protected
     * @param {string} eventName
     * @param {number} handler
     * @memberof BaseView
     */
    protected removeEventListner(eventName: string) {
        let handler = this._eventListeners.get(eventName);
        this._eventListeners.delete(eventName);
        this.eventManager.removeListener(eventName, handler);
    }

    /**
     * 延迟执行函数，会在 View 关闭时取消
     *
     * @protected
     * @param {number} delayDuration
     * @param {Function} callback
     * @returns {number}
     * @memberof BaseView
     */
    protected delayCall(delayDuration: number, callback: Function): number {
        let handler = this.timerManager.delayCall(delayDuration, callback);
        this._timerHandles.push(handler);
        return handler;
    }

    /**
     * 循环执行函数，会在 View 关闭时取消
     *
     * @protected
     * @param {number} delayDuration
     * @param {number} loopInterval
     * @param {Function} callback
     * @returns {number}
     * @memberof BaseView
     */
    protected loopCall(delayDuration: number, loopInterval: number, callback: Function): number {
        let handler = this.timerManager.loopCall(delayDuration, loopInterval, callback);
        this._timerHandles.push(handler);
        return handler;
    }

    /**
     * View 绑定的 Node 节点是否有效
     *
     * @return {*}
     * @memberof BaseView
     */
    public isValid(): boolean {
        return this.node !== null && this.node.isValid;
    }

    /**
     * View 绑定的 Node 节点是否启用
     *
     * @return {*}
     * @memberof BaseView
     */
    public isActive(): boolean {
        return this.node !== null && this.node.activeInHierarchy;
    }

    protected onActive(): void { }

    protected onInactive(): void { }

    public vm_show(args?: any, complete?: Function) {
        console.log(`Show view: ${cc.js.getClassName(this)}`);

        if (this.isValid()) {
            this.node!.active = true;
            let childCount = this.node.parent.children.length;
            this.node.setSiblingIndex(childCount);

            complete && complete();
            if (this.vm_viewAnimator) {
                this.vm_viewAnimator.show();
            }
        }
        this.onOpen(args);
    }

    public vm_hide(complete?: Function) {
        console.log(`Hide view: ${cc.js.getClassName(this)}`);

        this.getCall && this.getCall();

        if (this.isValid()) {
            let hideComplete = () => {
                this.node!.active = false;
                this.onClose();
                complete && complete();
            }
            if (this.vm_viewAnimator) {
                this.vm_viewAnimator.hide(hideComplete);
            } else {
                hideComplete();
            }
            this._$cancelTimers();
        }
    }

    public vm_setViewAnimator<T extends ViewDefaultAnimator>(viewAnimator: T) {
        this.vm_viewAnimator = viewAnimator;
        this.vm_viewAnimator.init(this.node);
    }

    /**
     * 暂停当前节点和子节点上所有的注册事件
     *
     * @memberof BaseView
     */
    public pause() {
        if (this.isValid()) {
            this.node!.pauseSystemEvents(true);
        }
        this.onPause();
    }

    /**
     * 恢复当前节点和子节点上所有的注册事件
     *
     * @memberof BaseView
     */
    public resume() {
        if (this.isValid()) {
            this.node!.resumeSystemEvents(true);
        }
        this.onResume();
    }

    protected registerDefaultCloseButton() {
        let closeButton = this.getComponentWithName('close_btn', cc.Button);
        this.addClickEventListener(closeButton, this._$closeButtonHandle);
    }

    private _$closeButtonHandle() {
        GameManager.getManager(ViewManager).hideView(this);
    }

    /**
     * 在 View 关闭的时候，停掉所有的计时器
     *
     * @private
     * @memberof BaseView
     */
    private _$cancelTimers() {
        this._timerHandles.forEach((handle) => {
            this.timerManager.cancel(handle);
        });
        this._timerHandles = [];
    }

    private _$removeButtonListeners() {
        this._buttonEventListeners.forEach((callback, btn) => {
            btn.node.off(ButtonClickEvent, callback, this);
        });
        this._buttonEventListeners.clear();
    }

    private _$removeEventListeners() {
        this._eventListeners.forEach((_, eventName) => {
            this.removeEventListner(eventName);
        });
        this._eventListeners.clear();
    }

    protected onPause() { }
    protected onResume() { }

    // #region 子类实现
    protected abstract onInit(): void;
    protected abstract onDestroy(): void;

    protected abstract onOpen(args?: any): void;
    protected abstract onClose(): void;
    // #endregion
}
