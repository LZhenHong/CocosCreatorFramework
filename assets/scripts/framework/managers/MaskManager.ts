import Mask from "../component/Mask";
import ViewOptions from "../component/ViewOptions";
import { ViewLayerEnum } from "../const/Enum";
import BaseManager from "../utility/BaseManager";
import RecyclePoolManager from "./RecyclePoolManager";

const Mask_Prefab_Path = 'prefabs/mask';

export default class MaskManager extends BaseManager {

    protected onInit() {
        let recyclePoolManager = this.gameManager.getManager(RecyclePoolManager);
        recyclePoolManager.preloadRecyclePrefab(Mask_Prefab_Path);
    }
    protected onDestroy() { }

    private _handleIndex = 0;
    private _maskMap = new Map<number, Mask>();

    public showMaskWithViewOptions(viewOptions: ViewOptions, callback?: Function): number {
        return this.showMaskInLayer(viewOptions.viewLayer, viewOptions.hideWhenClickMask, callback);
    }

    public showMaskInLayer(viewLayer: ViewLayerEnum, hideWhenClickMask: boolean, callback?: Function): number {
        let index = ++this._handleIndex;
        let recyclePoolManager = this.gameManager.getManager(RecyclePoolManager);
        let maskNode = recyclePoolManager.syncDequeueReuseNode(Mask_Prefab_Path);
        if (maskNode) {
            let container = this.gameManager.viewContainerForLayer(viewLayer);
            maskNode.setParent(container);

            let maskCp = maskNode.getComponent(Mask);
            this._maskMap.set(index, maskCp);
            if (maskCp) {
                maskCp.hideOnClick = hideWhenClickMask;
                maskCp.clickHandler = () => {
                    this.hideMask(index);
                    callback && callback();
                };
            }
        }
        return index;
    }

    public hideMask(handleIndex: number) {
        if (this._maskMap.has(handleIndex)) {
            let mask = this._maskMap.get(handleIndex);
            this._maskMap.delete(handleIndex);
            let recyclePoolManager = this.gameManager.getManager(RecyclePoolManager);
            recyclePoolManager.enqueueReuseNode(Mask_Prefab_Path, mask.node);
        }
    }

}
