import AssetsManager from "../managers/AssetsManager";
import BaseViewController from "../controller/BaseViewController";
import BaseManager from "../utility/BaseManager";
import BaseView from "./BaseView";
import MaskManager from "../managers/MaskManager";
import ViewDefaultAnimator from "../view_animator/ViewDefaultAnimator";
import { Constructor } from "../utility/GameUtility";
import GameManager from "../GameManager";
import EventManager from "../managers/EventManager";
import { Event } from "../const/Event";

export type ShowViewComplete = (isSucc: boolean, error?: Error) => void;

export default class ViewManager extends BaseManager {

    protected onInit() { }

    protected onDestroy() { }

    public showView<T extends BaseViewController<BaseView>>(viewController: T, args?: any, complete?: ShowViewComplete) {
        // 已经显示的 View 不需要再次显示
        if (viewController.view && viewController.view.isActive()) {
            return;
        }

        if (viewController.view && viewController.view.isValid()) {
            this.showMaskForView(viewController);
            viewController.view.vm_show(args, () => {
                GameManager.getManager(EventManager).dispatchEvent(Event.OpenView, viewController.viewName);
                complete && complete(true);
            });
        } else {
            viewController.vm_init();
            let viewPrefabPath = viewController.view.viewPrefabPath;
            let assetsMgr = this.gameManager.getManager(AssetsManager);
            assetsMgr.loadPrefab(viewPrefabPath, (isSucc, viewPrefab, error) => {
                if (isSucc) {
                    let viewNode = cc.instantiate(viewPrefab);
                    viewController.view.vm_init(viewNode);
                    this.showMaskForView(viewController);

                    let container = this.gameManager.viewContainerForLayer(viewController.view.viewOptions.viewLayer);
                    viewNode.setParent(container);
                    let viewAnimatorClazzName = this.gameManager.viewAnimatorForOption(viewController.view.viewOptions.viewAnimation);
                    let viewAnimatorClazz = cc.js.getClassByName(viewAnimatorClazzName) as Constructor<ViewDefaultAnimator>;
                    let viewAnimator = new viewAnimatorClazz() as ViewDefaultAnimator;
                    viewController.view.vm_setViewAnimator(viewAnimator);
                    viewController.view.vm_show(args, () => {
                        GameManager.getManager(EventManager).dispatchEvent(Event.OpenView, viewController.viewName);
                        complete && complete(true);
                    });
                } else {
                    console.error(`Show View: ${viewController.viewName}, Error: ${error.message}`);
                    complete && complete(false, error);
                }
            });
        }
    }

    private showMaskForView(viewController: BaseViewController<BaseView>) {
        if (viewController.view.viewOptions.showMask) {
            let maskManager = this.gameManager.getManager(MaskManager);
            if (viewController.view.vm_maskHandler) {
                maskManager.hideMask(viewController.view.vm_maskHandler);
            }
            let handler = maskManager.showMaskWithViewOptions(viewController.view.viewOptions, () => {
                this.hideViewForViewController(viewController);
            });
            viewController.view.vm_maskHandler = handler;
        }
    }

    public hideViewForViewController<T extends BaseViewController<BaseView>>(viewController: T) {
        if (viewController) {
            this.hideView(viewController.view);
        }
    }

    public hideView<T extends BaseView>(view: T, callback?: Function) {
        if (view && view.isActive()) {
            let func = () => {
                callback && callback();
                if (view.viewOptions.destroyWhenClose) {
                    view.vm_destroy();
                }
                GameManager.getManager(EventManager).dispatchEvent(Event.HideView, cc.js.getClassName(view));
            }
            view.vm_hide(func);

            let maskManager = this.gameManager.getManager(MaskManager);
            maskManager.hideMask(view.vm_maskHandler);
        }
    }

}
