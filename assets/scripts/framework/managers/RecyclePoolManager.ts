import BaseManager from "../utility/BaseManager";
import AssetsManager from "./AssetsManager";

export type RecycleFunction = (node: cc.Node) => void;

export interface RecycleItemInterface {
    recycle(node: cc.Node): void;
}

export default class RecyclePoolManager extends BaseManager {

    private _poolMap = new Map<string, cc.NodePool>();
    private _prefabMap = new Map<string, cc.Prefab>();

    protected onInit() {
        this._poolMap.clear();
    }

    protected onDestroy() {
        this._poolMap.forEach((pool) => {
            pool.clear();
        });
        this._poolMap.clear();
    }

    public setRecyclePrefab(prefabPath: string, prefab: cc.Prefab) {
        this._prefabMap.set(prefabPath, prefab);
    }

    public preloadRecyclePrefab(prefabPath: string) {
        let assetMgr = this.gameManager.getManager(AssetsManager);
        assetMgr.loadPrefab(prefabPath, (isSucc, prefab, error) => {
            if (isSucc) {
                this._prefabMap.set(prefabPath, prefab);
            } else {
                console.error(`RecyleManager preload prefab: ${prefabPath}, error: ${error.message}`);
            }
        });
    }

    public dequeueReuseNode(prefabPath: string, callback?: RecycleFunction) {
        let pool = this.getPool(prefabPath);
        let node = pool.get();
        if (!node) {
            if (this._prefabMap.has(prefabPath) && this._prefabMap.get(prefabPath)) {
                let prefab = this._prefabMap.get(prefabPath);
                let node = cc.instantiate(prefab);
                callback && callback(node);
                return;
            }
            
            let assetMgr = this.gameManager.getManager(AssetsManager);
            assetMgr.loadPrefab(prefabPath, (isSucc, prefab, error) => {
                if (isSucc) {
                    this._prefabMap.set(prefabPath, prefab);

                    node = cc.instantiate(prefab);
                } else {
                    console.error(`RecyleManager load prefab: ${prefabPath}, error: ${error.message}`);
                }
                callback && callback(node);
            });
        } else {
            callback && callback(node);
        }
    }

    public syncDequeueReuseNode(prefabPath: string): cc.Node | null {
        let pool = this.getPool(prefabPath);
        let node = pool.get();
        if (!node) {
            if (this._prefabMap.has(prefabPath) && this._prefabMap.get(prefabPath)) {
                let prefab = this._prefabMap.get(prefabPath);
                node = cc.instantiate(prefab);
            }
        }
        return node;
    }

    public enqueueReuseNode(key: string, node: cc.Node) {
        let pool = this.getPool(key);
        pool.put(node);
    }

    public enqueueReuseNodeWithComponent<T extends cc.Component>(key: string, component: T) {
        let node = component.node;
        if ('recycle' in component) {
            (component as any).recycle(node);
        }
        this.enqueueReuseNode(key, node);
    }

    public clearPool(key: string) {
        let pool = this.getPool(key);
        pool.clear();
    }

    public poolSize(key: string): number {
        let pool = this.getPool(key);
        return pool.size();
    }

    private getPool(key: string): cc.NodePool {
        if (!this._poolMap.has(key)) {
            this._poolMap.set(key, new cc.NodePool());
        }
        return this._poolMap.get(key);
    }
}
