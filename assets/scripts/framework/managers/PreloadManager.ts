import PreloadHolder from "../component/PreloadHolder";
import BaseManager from "../utility/BaseManager";
import { Constructor } from "../utility/GameUtility";
import AssetsManager from "./AssetsManager";

export default class PreloadManager extends BaseManager {

    private _preloadPrefabPath = 'prefabs/preload';
    private _preloadNode: cc.Node = null;
    private _preloadHolder: PreloadHolder = null;

    protected onInit() { }

    public preloadPrefab(complete: (isSuccess: boolean) => void, progressCallback?: (progress: number) => void) {
        let assetMgr = this.gameManager.getManager(AssetsManager);
        assetMgr.loadPrefab(this._preloadPrefabPath, (isSucc, prefab, error) => {
            if (isSucc) {
                this._preloadNode = cc.instantiate(prefab);
                cc.game.addPersistRootNode(this._preloadNode);

                this._preloadHolder = this._preloadNode.getComponent(PreloadHolder);
            } else {
                console.error(`Preload: ${this._preloadPrefabPath}, error: ${error.message}`);
            }
            complete && complete(isSucc);
        }, (progress) => {
            progressCallback && progressCallback(progress);
        });
    }

    public getPreloadAssetWithName<T extends cc.Asset>(name: string, assetType: Constructor<T>): T | null {
        if (this._preloadHolder) {
            return this._preloadHolder.getAssetWithName(name, assetType);
        }
        return null;
    }

    protected onDestroy() {
        cc.game.removePersistRootNode(this._preloadNode);
        this._preloadNode.destroy();
        this._preloadNode = null;
        this._preloadHolder = null;
    }
}
