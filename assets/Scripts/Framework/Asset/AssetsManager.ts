import { director, _decorator, assetManager, resources, Asset, AssetManager, Constructor } from 'cc';
import { DEV, EDITOR } from 'cc/env';
import { Scene } from '../Enum';
import { BaseManager } from "../Utility/BaseManager";

export type AssetLoadProgress = (progress: number) => void;
export type AssetLoadComplete<T extends Asset> = (isSuccess: boolean, asset: T, error?: Error) => void;

export class AssetsManager extends BaseManager {
    protected onInit() { }

    protected onDestroy() { }

    public loadAssetFromBundle<T extends Asset>(assetPath: string, asset: Constructor<T>, bundle: AssetManager.Bundle, assetLoadComplete: AssetLoadComplete<T>, assetLoadProgress: AssetLoadProgress) {
        this.loadAssetsFromBundle([assetPath], asset, bundle, assetLoadComplete, assetLoadProgress);
    }

    public loadAssetsFromBundle<T extends Asset>(assetPaths: string[], asset: Constructor<T>, bundle: AssetManager.Bundle, assetLoadComplete: AssetLoadComplete<T>, assetLoadProgress: AssetLoadProgress) {

    }
}
