import SDKParameter from "./SDKParameter";

export default abstract class SDKAgent {

    /**
     * 是否是第一次初始化 SDK
     *
     * @protected
     * @type {boolean}
     * @memberof SDKAgent
     */
    protected _isFirstTime: boolean = true;

    public init(parameter: SDKParameter) {
        this.onInit(parameter);
        this._isFirstTime = false;
    }

    public destroy() {
        this.onDestroy();
    }

    protected abstract onInit(parameter: SDKParameter): void;
    public abstract setUserId(userId: string): void;
    protected abstract onDestroy(): void;

}
