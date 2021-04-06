import { _decorator } from 'cc';
const { ccclass } = _decorator;

/**
 * 基础的控制器类
 *
 * @export
 * @abstract
 * @class BaseController
 */
@ccclass('BaseController')
export abstract class BaseController {
    public vm_init() {

    }

    public vm_destroy() {

    }

    // #region 子类回调
    protected abstract onInit(): void;
    protected abstract onDestroy(): void;
    // #endregion
}
