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

    /**
     * 创建绑定的 View 类
     * @warning 这里会自动根据 Controller 的命名来匹配对应的 View，所以 Controller 和 View 的命名是有规则的
     * @example ExampleViewController 对应的 View 就是 ExampleView
     * @private
     * @memberof BaseViewController
     */
    private _createView() {
        let clazzName = js.getClassName(this);
        this._viewClazzName = clazzName.replace('Controller', '');
        let viewClazz = js.getClassByName(this._viewClazzName);
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

    /**
     * 显示绑定的 View 节点
     *
     * @memberof BaseViewController
     */
    showView() {
        if (this.view) {
            this.view.show();
        }
    }

    /**
     * 隐藏绑定的 View 节点
     *
     * @memberof BaseViewController
     */
    hideView() {
        if (this.view) {
            this.view.hide();
        }
    }

    /**
     * 从节点树中销毁 View 节点
     *
     * @memberof BaseViewController
     */
    destroyView() {
        this.hideView();
    }
}
