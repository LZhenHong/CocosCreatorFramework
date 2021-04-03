import { _decorator, Component, Animation, Button } from 'cc';
import { ViewHolder } from './ViewHolder';
import { ViewOptions } from './ViewOptions';
const { ccclass } = _decorator;

@ccclass('BaseView')
export abstract class BaseView {
    protected gameObject: Component|null = null;
    protected animation: Animation|null = null;
    protected viewOptions: ViewOptions|null = null;
    protected viewHolder: ViewHolder|null = null;

    private _buttonEventListeners: Map<Button, Function> = new Map<Button, Function>();
    
    /**
     * 只能被 ViewManager 调用
     *
     * @protected
     * @param {Component} component View 对象
     * @memberof BaseView
     */
    protected vm_onInit(component: Component) {
        this.gameObject = component;
        this.animation = this.gameObject.getComponent(Animation);
        this.viewHolder = this.gameObject.getComponent(ViewHolder);
        this.viewOptions = this.gameObject.getComponent(ViewOptions);

        this.onInit();
    }

    /**
     * 销毁 View
     * 只能被 ViewManager 调用
     * @protected
     * @memberof BaseView
     */
    protected vm_destroy() {
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
