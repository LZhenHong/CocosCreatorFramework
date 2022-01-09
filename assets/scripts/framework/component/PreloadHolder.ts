import { Constructor } from "../utility/GameUtility";

const { ccclass, property, menu, disallowMultiple } = cc._decorator;

@ccclass
@disallowMultiple
@menu('Framework/PreloadHolder')
export default class PreloadHolder extends cc.Component {
    @property({ type: [cc.Prefab], tooltip: '预加载的预制体', displayName: 'Preload Prefabs' })
    public prefabs: cc.Prefab[] = [];

    @property({ type: [cc.AudioClip], tooltip: '预加载的音效文件', displayName: 'Preload Audios' })
    public audios: cc.AudioClip[] = [];

    @property({ type: [cc.SpriteAtlas], tooltip: '预加载的合图', displayName: 'Preload SpriteAtlas' })
    public atlas: cc.SpriteAtlas[] = [];

    @property({ type: [cc.SpriteFrame], tooltip: '预加载的图片资源', displayName: 'Preload Sprites' })
    public sprites: cc.SpriteFrame[] = [];

    @property({ type: [cc.TextAsset], tooltip: '预加载的文本资源', displayName: 'Preload Texts' })
    public texts: cc.TextAsset[] = [];

    private _prefabMap: Map<string, cc.Prefab> = new Map();
    private _audioMap: Map<string, cc.AudioClip> = new Map();
    private _atlasMap: Map<string, cc.SpriteAtlas> = new Map();
    private _spriteMap: Map<string, cc.SpriteFrame> = new Map();
    private _textMap: Map<string, cc.TextAsset> = new Map();

    private mapAssets<T extends cc.Asset>(assets: T[], map: Map<string, T>) {
        map.clear();
        if (assets.length > 0) {
            for (let asset of assets) {
                if (asset === null) {
                    continue;
                }
                let name = asset.name;
                map.set(name, asset);
            }
        }
    }

    private mapAssetsIfCould() {
        if (this.prefabs.length != this._prefabMap.size) {
            this.mapAssets(this.prefabs, this._prefabMap);
        }
        if (this.audios.length != this._audioMap.size) {
            this.mapAssets(this.audios, this._audioMap);
        }
        if (this.atlas.length != this._atlasMap.size) {
            this.mapAssets(this.atlas, this._atlasMap);
        }
        if (this.sprites.length != this._spriteMap.size) {
            this.mapAssets(this.sprites, this._spriteMap);
        }
        if (this.texts.length != this._textMap.size) {
            this.mapAssets(this.texts, this._textMap);
        }
    }

    public getAssetWithName<T extends cc.Asset>(name: string, assetClazz: Constructor<T>): T | null {
        this.mapAssetsIfCould();
        let assetClazzName = cc.js.getClassName(assetClazz);
        switch (assetClazzName) {
            case 'cc.Prefab':
                return this._prefabMap.get(name) as any;
            case 'cc.AudioClip':
                return this._audioMap.get(name) as any;
            case 'cc.SpriteAtlas':
                if (this._atlasMap.has(name) && this._atlasMap.get(name)) {
                    return this._atlasMap.get(name) as any;
                }
                let atlas = `${name}.plist`;
                return this._atlasMap.get(atlas) as any;
            case 'cc.SpriteFrame':
                return this._spriteMap.get(name) as any;
            case 'cc.TextAsset':
                if (this._textMap.has(name) && this._textMap.get(name)) {
                    return this._textMap.get(name) as any;
                }
                return this.tryAcquireFileNameWithExtension(name) as any;
        }
        return null;
    }

    private tryAcquireFileNameWithExtension(name: string): cc.TextAsset | null {
        let textFileExtensions = [".txt", ".plist", ".xml", ".json", ".yaml", ".ini", ".csv", ".md"];
        for (let ext of textFileExtensions) {
            let fileName = name + ext;
            if (this._textMap.has(fileName) && this._textMap.get(fileName)) {
                return this._textMap.get(fileName) as any;
            }
        }
        return null;
    }

}
