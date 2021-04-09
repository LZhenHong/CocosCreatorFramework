import { director, _decorator } from 'cc';
import { BaseManager } from "./Utility/BaseManager";

export enum Scene {
    Main = 'main'
}

export type AssetLoadProgress = (progress: number, item: any) => void;
export type AssetLoadComplete = (isSuccess: boolean, error?: Error) => void;

export class AssetsManager extends BaseManager {
    protected onInit() {}

    protected onDestroy() {}

    /**
     * 预加载 Scene，加载完成后不会自动切换 Scene
     *
     * @param {Scene} scene Scene 名称，枚举类型
     * @param {AssetLoadComplete} [complete] 预加载完成后的回调
     * @memberof AssetsManager
     */
    public preloadScene(scene: Scene, progress?: AssetLoadProgress, complete?: AssetLoadComplete) {
        director.preloadScene(scene, (completedCount, totalCount, item) => {
            var percent = completedCount / totalCount;
            percent = Math.floor(percent * 100);
            progress !== null && progress!(percent, item);
        }, (error, sceneAsset) => {
            if (error !== null && sceneAsset === null) {
                complete !== null && complete!(false, error);
            } else {
                complete !== null && complete!(true);
            }
        });
    }

    public loadScene(scene: Scene, callback: AssetLoadComplete) {}
}
