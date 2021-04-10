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
        this._inited = false;
        this.onDestroy();
    }

    public update(deltaTime: number) {
        this.onUpdate(deltaTime);
    }

    public lateUpdate(deltaTime: number) {
        this.lateUpdate(deltaTime);
    }

    public get hasInited() {
        return this._inited;
    }

    protected onUpdate(deltaTime: number) {}
    protected onLateUpdate(deltaTime: number) {}

    protected abstract onInit(): void;
    protected abstract onDestroy(): void;
}
