import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('BaseManager')
export abstract class BaseManager {
    private _inited: boolean = false;

    public init() {
        this.onInit();
        this._inited = true;
    }

    public destroy() {
        this.onDestroy();
    }

    public get hasInited() {
        return this._inited;
    }

    protected abstract onInit(): void;
    protected abstract onDestroy(): void;
}
