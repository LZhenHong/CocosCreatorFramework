import { _decorator, Node, Animation, Button, js, Asset, Constructor, Component } from 'cc';
import { GameManager } from '../GameManager';
import { GameUtility } from '../Utility/GameUtility';
import { AssetHolder } from '../Component/AssetHolder';
import { NodeHolder } from '../Component/NodeHolder';
import { ViewOptions } from '../Component/ViewOptions';
import { ActiveType } from '../Component/ActiveListener';
const { ccclass } = _decorator;

/**
 * 基础的 View 类
 *
 * @export
 * @abstract
 * @class BaseView
 */
@ccclass('BaseView')
export abstract class BaseView {
    protected node: Node | null = null;
    protected animation: Animation | null = null;
    protected viewOptions: ViewOptions | null = null;
    protected nodeHolder: NodeHolder | null = null;
    protected assetHolder: AssetHolder | null = null;

    private _buttonEventListeners: Map<Button, Function> = new Map<Button, Function>();
    private _viewPrefabName: string = '';

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
    public vm_init(node: Node) {
        this.node = node;
        this.animation = this.node.getComponent(Animation);
        this.nodeHolder = this.node.getComponent(NodeHolder);
        this.assetHolder = this.node.getComponent(AssetHolder);
        this.viewOptions = this.node.getComponent(ViewOptions);
        this._buttonEventListeners.clear();

        this._initRest();

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
        let clazzName = js.getClassName(this);
        this._viewPrefabName = GameUtility.camelCaseToUnderScore(clazzName);
    }

    /**
     * 获取 View 对应的 Prefab 路径
     *
     * @return {*}
     * @memberof BaseView
     */
    public viewPrefabPath() {
        let path = GameManager.sharedInstance()?.viewPrefabDirectory + this._viewPrefabName;
        return path;
    }

    /**
     * 销毁 View
     * 只能被 ViewManager 调用
     * @public
     * @memberof BaseView
     */
    public vm_destroy() {
        this._buttonEventListeners.forEach((callback, btn) => {
            btn.node.off(Button.EventType.CLICK, callback, this);
        });
        this._buttonEventListeners.clear();

        /// 取消 Active 监听
        this.node?.off(ActiveType.Active, this.onActive, this);
        this.node?.off(ActiveType.Inactive, this.onInactive, this);

        this.onDestroy();
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
    protected getComponentWithName<T extends Component>(name: string, componentClazz: Constructor<T>) {
        if (this.nodeHolder) {
            return this.nodeHolder.getComponentWithName(name, componentClazz);
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
    protected getAssetWithName<T extends Asset>(name: string) {
        if (this.assetHolder) {
            return this.assetHolder.getAssetWithName<T>(name);
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
    protected addClickEventListener(btn: Button | null, callback: Function) {
        if (!btn) {
            return;
        }

        btn.node.on(Button.EventType.CLICK, callback, this);
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
    protected removeClickEventListener(btn: Button, callback: Function) {
        btn.node.off(Button.EventType.CLICK, callback, this);
        this._buttonEventListeners.delete(btn);
    }

    /**
     * View 绑定的 Node 节点是否有效
     *
     * @return {*}
     * @memberof BaseView
     */
    public isValid() {
        return this.node !== null && this.node.isValid;
    }

    /**
     * View 绑定的 Node 节点是否启用
     *
     * @return {*}
     * @memberof BaseView
     */
    public isActive() {
        return this.node !== null && this.node.activeInHierarchy;
    }

    protected onActive(): void { }

    protected onInactive(): void { }

    public show() {
        if (this.isValid()) {
            this.node!.active = true;
        }
        this.onOpen();
    }

    public hide() {
        if (this.isValid()) {
            this.node!.active = false;
        }
        this.onClose();
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

    // #region 子类实现
    protected abstract onInit(): void;
    protected abstract onDestroy(): void;

    protected abstract onOpen(): void;
    protected abstract onClose(): void;

    protected abstract onPause(): void;
    protected abstract onResume(): void;
    // #endregion
}
