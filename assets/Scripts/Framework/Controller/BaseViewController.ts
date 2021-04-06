import { _decorator } from 'cc';
import { BaseView } from '../View/BaseView';
import { BaseController } from './BaseController';
const { ccclass } = _decorator;

@ccclass('BaseViewController')
export abstract class BaseViewController<VT extends BaseView> extends BaseController {
    protected view: VT|null = null;

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
