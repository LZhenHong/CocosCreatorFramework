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
    /**
     * 被 GameManager 调用初始化
     *
     * @memberof BaseController
     */
    init() {
        this.onInit();
    }

    /**
     * 被 GameManager 调用的销毁
     *
     * @memberof BaseController
     */
    destroy() {
        this.onDestroy();
    }

    /**
     * 游戏启动回调
     *
     * @memberof BaseController
     */
    gameStart() {
        this.onGameStart();
    }

    // #region 子类回调
    protected abstract onInit(): void;
    protected abstract onDestroy(): void;

    protected abstract onGameStart(): void;
    // #endregion
}
