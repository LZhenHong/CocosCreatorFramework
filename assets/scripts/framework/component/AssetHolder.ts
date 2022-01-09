import ObjectHolder from "./ObjectHolder";

const { ccclass, property, disallowMultiple, menu } = cc._decorator;

@ccclass
@disallowMultiple
@menu('Framework/AssetHolder')
export default class AssetHolder extends ObjectHolder<cc.Asset> {
    @property({ type: [cc.Asset], tooltip: "需要访问的资源", displayName: "Asset References" })
    public assets: (cc.Asset | null)[] = [];

    getAssetWithName<T extends cc.Asset>(name: string) {
        let asset = this.getObjectWithName(name);
        return asset as T;
    }

    objectsForMap(): cc.Asset[] {
        return this.assets;
    }

    onReset() {
        this.assets = [];
    }

}
