import { _decorator, Component, Asset } from 'cc';
const { ccclass, property, disallowMultiple } = _decorator;

@ccclass('AssetHolder')
@disallowMultiple
export class AssetHolder extends Component {
    @property({type: [Asset], tooltip: "需要访问的资源", displayName: "Asset Refrences"})
    public assets: (Asset|null)[] = [];

    private _assetMap: Map<string, Asset> = new Map();

    onLoad() {
        this._mapAssets();
    }

    _mapAssets() {
        this._assetMap.clear();
        if (this.assets.length > 0) {
            for (const asset of this.assets) {
                if (asset === null) {
                    continue;
                }
                const name = asset.name;
                this._assetMap.set(name, asset);
            }
        }
    }

    getAssetWithName<T extends Asset>(name: string) {
        return this._assetMap.get(name) as T;
    }

    resetInEditor() {
        this.assets = [];
        this._assetMap.clear();
    }
}
