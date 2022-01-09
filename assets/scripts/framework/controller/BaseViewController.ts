import { Constructor } from '../utility/GameUtility';
import BaseView from '../view/BaseView';
import ViewManager from '../view/ViewManager';
import BaseController from './BaseController';
const { ccclass } = cc._decorator;

@ccclass
export default abstract class BaseViewController<T extends BaseView> extends BaseController {
    public view: T | null = null;

    private _viewClazzName: string = '';
    get viewName(): string {
        return this._viewClazzName;
    }

    protected viewManager: ViewManager;
    public gm_init(viewManager: ViewManager) {
        this.viewManager = viewManager;
    }

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
        let clazzName = cc.js.getClassName(this);
        this._viewClazzName = clazzName.replace('Controller', '');
        let viewClazz = cc.js.getClassByName(this._viewClazzName) as Constructor<T>;
        this.view = new viewClazz() as T;
    }

    /**
     * 显示绑定的 View 节点
     *
     * @memberof BaseViewController
     */
    showView(args?: any, complete?: Function) {
        this.viewManager.showView(this, args, () => {
            complete && complete(this);
        });
    }

    /**
     * 隐藏绑定的 View 节点
     *
     * @memberof BaseViewController
     */
    hideView(complete?: Function) {
        this.viewManager.hideView(this.view, complete);
    }

    /**
     * 从节点树中销毁 View 节点
     *
     * @memberof BaseViewController
     */
    destroyView() {
        if (this.view) {
            this.view.vm_destroy();
        }
        this.view = null;
    }
}
