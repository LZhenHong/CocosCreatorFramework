import { _decorator, Component, Animation, Button, js } from 'cc';
import { GameManager } from '../GameManager';
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
     * 给 Button 添加点击监听，无需在 Destroy 时移除监听
     *
     * @protected
     * @param {Button} btn Button 按钮
     * @param {Function} callback 监听回调
     * @memberof BaseView
     */
    protected addClickEventListener(btn: Button, callback: Function) {
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

    protected abstract onInit(): void;
    protected abstract onDestroy(): void;

    protected abstract onOpen(): void;
    protected abstract onClose(): void;
}
