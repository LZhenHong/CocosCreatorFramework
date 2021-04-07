import { _decorator, js } from 'cc';
import { BaseView } from '../View/BaseView';
import { BaseController } from './BaseController';
const { ccclass } = _decorator;

@ccclass('BaseViewController')
export abstract class BaseViewController<T extends BaseView> extends BaseController {
    protected view: T|null = null;

    private _viewClazzName: string = '';

    /**
     * 初始化
     * 只能被 ViewManager 调用
     *
     * @memberof BaseViewController
     */
    public vm_init() {
        this._createView();
    }

    private _createView() {
        const clazzName = js.getClassName(this);
        this._viewClazzName = clazzName.replace('Controller', '');
        const viewClazz = js.getClassByName(this._viewClazzName);
        this.view = new viewClazz() as T;
    }

    /**
     * 销毁
     * 只能被 ViewManager 调用
     *
     * @memberof BaseViewController
     */
    public vm_destroy() {

    }

    showView() {
        if (this.view) {
            this.view.show();
        }
    }

    hideView() {
        if (this.view) {
            this.view.hide();
        }
    }
}
