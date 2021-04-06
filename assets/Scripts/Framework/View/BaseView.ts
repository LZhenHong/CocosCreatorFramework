import { _decorator, Component, Animation, Button, js, Asset } from 'cc';
import { GameManager } from '../GameManager';
import { AssetHolder } from './AssetHolder';
import { ViewHolder } from './ViewHolder';
import { ViewOptions } from './ViewOptions';
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
    protected gameObject: Component|null = null;
    protected animation: Animation|null = null;
    protected viewOptions: ViewOptions|null = null;
    protected viewHolder: ViewHolder|null = null;
    protected assetHolder: AssetHolder|null = null;

    private _buttonEventListeners: Map<Button, Function> = new Map<Button, Function>();
    private _viewPrefabName: string = '';
    
    /**
     * 初始化 View
     * 只能被 ViewManager 调用
     *
     * @public
     * @param {Component} component View 对象
     * @memberof BaseView
     */
    public vm_init(component: Component) {
        this.gameObject = component;
        this.animation = this.gameObject.getComponent(Animation);
        this.viewHolder = this.gameObject.getComponent(ViewHolder);
        this.assetHolder = this.gameObject.getComponent(AssetHolder);
        this.viewOptions = this.gameObject.getComponent(ViewOptions);
        this._buttonEventListeners.clear();

        this._clazzNameToViewPrefab();

        this.onInit();
    }

    private _clazzNameToViewPrefab() {
        var clazzName = js.getClassName(this);
        const re = /[A-Z]/;
        var index = clazzName.search(re);
        while (index !== -1) {
            const firstStr = clazzName.substring(0, index);
            var lastStr = clazzName.substring(index);
            const firstChar = lastStr.charAt(0).toLocaleLowerCase();
            lastStr = '_' + firstChar + lastStr.substring(1);
            clazzName = firstStr.concat(lastStr);
            index = clazzName.search(re);
        };

        if (clazzName.startsWith('_')) {
            clazzName = clazzName.substring(1);
        }
        this._viewPrefabName = clazzName;
    }

    public viewPrefabPath() {
        const path = GameManager.sharedInstance()?.viewPrefabDirectory + this._viewPrefabName;
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

        this.onDestroy();
    }

    /**
     * 获取 ViewHolder 的引用
     *
     * @protected
     * @template T Component 引用类型
     * @param {string} name 引用的名称
     * @returns
     * @memberof BaseView
     */
    protected getGameObjectWithName<T extends Component>(name: string) {
        if (this.viewHolder) {
            return this.viewHolder.getGameObjectWithName<T>(name);
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
    protected addClickEventListener(btn: Button|null, callback: Function) {
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

    public show() {
        this.onOpen();
    }

    public hide() {
        this.onClose();
    }

    // #region 子类实现
    protected abstract onInit(): void;
    protected abstract onDestroy(): void;

    protected abstract onOpen(): void;
    protected abstract onClose(): void;
    // #endregion
}
