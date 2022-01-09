import BaseManager from "../utility/BaseManager";

export type ScenePreloadComplete = (isSuccess: boolean, error?: Error) => void;
export type AssetLoadProgress = (progress: number, url: string) => void;
export type AssetLoadComplete<T extends cc.Asset> = (isSuccess: boolean, asset: T, error?: Error) => void;
export type AssetsLoadComplete<T extends cc.Asset> = (isSuccess: boolean, asset: T[], error?: Error) => void;
export type BundleLoadComplete = (isSuccess: boolean, bundle: cc.AssetManager.Bundle, error?: Error) => void;

export default class AssetsManager extends BaseManager {

    protected onInit() { }

    protected onDestroy() { }

    // #region Load asset form cc.resources
    preloadAsset<T extends cc.Asset>(assetPath: string, assetType: typeof cc.Asset, complete: AssetLoadComplete<T>) {
        this.preloadAssetFromBundle(cc.resources, assetPath, assetType, complete);
    }

    preloadAssets<T extends cc.Asset>(assetPaths: string[], assetType: typeof cc.Asset, complete: AssetsLoadComplete<T>) {
        this.preloadAssetsFromBundle(cc.resources, assetPaths, assetType, complete);
    }

    loadPrefab(prefabPath: string, complete: AssetLoadComplete<cc.Prefab>, progress?: AssetLoadProgress) {
        this.loadAsset<cc.Prefab>(prefabPath, cc.Prefab, complete, progress);
    }

    loadAtlas(atlasPath: string, complete: AssetLoadComplete<cc.SpriteAtlas>, progress?: AssetLoadProgress) {
        this.loadAsset<cc.SpriteAtlas>(atlasPath, cc.SpriteAtlas, complete, progress);
    }

    loadTexture(texturePath: string, complete: AssetLoadComplete<cc.SpriteFrame>, progress?: AssetLoadProgress) {
        this.loadAsset<cc.SpriteFrame>(texturePath, cc.SpriteFrame, complete, progress);
    }

    loadAudio(audioPath: string, complete: AssetLoadComplete<cc.AudioClip>, progress?: AssetLoadProgress) {
        this.loadAsset<cc.AudioClip>(audioPath, cc.AudioClip, complete, progress);
    }

    loadText(textPath: string, complete: AssetLoadComplete<cc.TextAsset>, progress?: AssetLoadProgress) {
        this.loadAsset<cc.TextAsset>(textPath, cc.TextAsset, complete, progress);
    }

    loadAsset<T extends cc.Asset>(assetPath: string, assetType: typeof cc.Asset, complete: AssetLoadComplete<T>, progress?: AssetLoadProgress) {
        this.loadAssetFromBundle(cc.resources, assetPath, assetType, complete, progress);
    }

    loadAssets<T extends cc.Asset>(assetPaths: string[], assetType: typeof cc.Asset, complete: AssetsLoadComplete<T>, progress?: AssetLoadProgress) {
        this.loadAssetsFromBundle(cc.resources, assetPaths, assetType, complete, progress);
    }

    preloadScene(sceneName: string, complete?: ScenePreloadComplete, progress?: AssetLoadProgress) {
        this.preloadSceneFromBundle(cc.resources, sceneName, complete, progress);
    }

    loadScene(sceneName: string, complete: AssetLoadComplete<cc.SceneAsset>, progress?: AssetLoadProgress) {
        this.loadSceneFromBundle(cc.resources, sceneName, complete, progress);
    }
    // #endregion

    loadBundle(name: string, complete: BundleLoadComplete) {
        cc.assetManager.loadBundle(name, (error: Error, bundle: cc.AssetManager.Bundle) => {
            if (!error && bundle) {
                complete(true, bundle);
            } else {
                complete(false, null, error);
            }
        });
    }

    loadBundleWithPath(path: string, complete: BundleLoadComplete) {
        cc.assetManager.loadBundle(path, (error: Error, bundle: cc.AssetManager.Bundle) => {
            if (!error && bundle) {
                complete(true, bundle);
            } else {
                complete(false, null, error);
            }
        });
    }

    loadRemoteBundle(url: string, complete: BundleLoadComplete) {
        cc.assetManager.loadBundle(url, (error: Error, bundle: cc.AssetManager.Bundle) => {
            if (!error && bundle) {
                complete(true, bundle);
            } else {
                complete(false, null, error);
            }
        });
    }

    loadAssetFromBundle<T extends cc.Asset>(
        bundle: cc.AssetManager.Bundle,
        assetPath: string,
        assetType: typeof cc.Asset,
        complete: AssetLoadComplete<T>,
        progress?: AssetLoadProgress) {
        this.loadAssetsFromBundle(bundle, [assetPath], assetType, (success, assets, error) => {
            if (success) {
                complete(true, assets[0] as T);
            } else {
                complete(false, null, error);
            }
        }, progress);
    }

    loadAssetsFromBundle<T extends cc.Asset>(
        bundle: cc.AssetManager.Bundle,
        assetPaths: string[],
        assetType: typeof cc.Asset,
        complete: AssetsLoadComplete<T>,
        progress?: AssetLoadProgress) {
        bundle.load<T>(assetPaths, assetType, (finish, total, asset) => {
            let percent = Math.floor((finish / total) * 100);
            progress && progress(percent, asset.url);
        }, (error, assets) => {
            if (!error && assets && assets.length > 0) {
                let loadAssets = assets.map((asset) => {
                    return asset as T;
                });
                complete(true, loadAssets);
            } else {
                complete(false, null, error);
            }
        });
    }

    preloadAssetFromBundle<T extends cc.Asset>(
        bundle: cc.AssetManager.Bundle,
        assetPath: string,
        assetType: typeof cc.Asset,
        complete: AssetLoadComplete<T>) {
        this.preloadAssetsFromBundle(bundle, [assetPath], assetType, (isSuccess, assets, error) => {
            if (isSuccess) {
                complete(true, assets[0] as T);
            } else {
                complete(false, null, error);
            }
        });
    }

    preloadAssetsFromBundle<T extends cc.Asset>(
        bundle: cc.AssetManager.Bundle,
        assetPaths: string[],
        assetType: typeof cc.Asset,
        complete: AssetsLoadComplete<T>) {
        bundle.preload(assetPaths, assetType, (error, assets) => {
            if (!error && assets && assets.length > 0) {
                let loadAssets = assets.map((asset) => {
                    return asset.content as T;
                });
                complete(true, loadAssets);
            } else {
                complete(false, null, error);
            }
        });
    }

    preloadSceneFromBundle(
        bundle: cc.AssetManager.Bundle,
        sceneName: string,
        complete?: ScenePreloadComplete,
        progress?: AssetLoadProgress) {
        bundle.preloadScene(sceneName, (finish, total, asset) => {
            let percent = Math.floor((finish / total) * 100);
            progress && progress(percent, asset.url);
        }, (error) => {
            complete && complete(error === null, error);
        });
    }

    loadSceneFromBundle(
        bundle: cc.AssetManager.Bundle,
        sceneName: string,
        complete: AssetLoadComplete<cc.SceneAsset>,
        progress?: AssetLoadProgress) {
        bundle.loadScene(sceneName, (finish, total, asset) => {
            let percent = Math.floor((finish / total) * 100);
            progress && progress(percent, asset.url);
        }, (error, asset) => {
            if (!error && asset) {
                complete(true, asset as cc.SceneAsset);
            } else {
                complete(false, null, error);
            }
        });
    }

    preloadDirectoryFromBundle<T extends cc.Asset>(
        bundle: cc.AssetManager.Bundle,
        directory: string,
        assetType: typeof cc.Asset,
        complete: AssetsLoadComplete<T>,
        progress?: AssetLoadProgress) {
        bundle.preloadDir(directory, assetType, (finish, total, asset) => {
            let percent = Math.floor((finish / total) * 100);
            progress && progress(percent, asset.url);
        }, (error, assets) => {
            if (!error && assets && assets.length > 0) {
                let loadAssets = assets.map((asset) => {
                    return asset.content as T;
                });
                complete(true, loadAssets);
            } else {
                complete(false, null, error);
            }
        });
    }

    loadDirectoryFromBundle<T extends cc.Asset>(
        bundle: cc.AssetManager.Bundle,
        directory: string,
        assetType: typeof cc.Asset,
        complete: AssetsLoadComplete<T>,
        progress?: AssetLoadProgress) {
        bundle.loadDir(directory, assetType, (finish, total, asset) => {
            let percent = Math.floor((finish / total) * 100);
            progress && progress(percent, asset.url);
        }, (error, assets) => {
            if (!error && assets && assets.length > 0) {
                let loadAssets = assets.map((asset) => {
                    return asset as T;
                });
                complete(true, loadAssets);
            } else {
                complete(false, null, error);
            }
        });
    }

}
