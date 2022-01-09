import GameManager from "../GameManager";

const { ccclass } = cc._decorator;

@ccclass
export default abstract class BaseManager {
    private _inited: boolean = false;
    protected gameManager: GameManager;

    public init(mgr: GameManager) {
        this.gameManager = mgr;
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
        this.onLateUpdate(deltaTime);
    }

    public get hasInited() {
        return this._inited;
    }

    protected onUpdate(deltaTime: number) { }
    protected onLateUpdate(deltaTime: number) { }

    protected abstract onInit(): void;
    protected abstract onDestroy(): void;
}
