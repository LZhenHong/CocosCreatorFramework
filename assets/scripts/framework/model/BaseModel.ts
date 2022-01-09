import GameManager from "../GameManager";
import PrefManager from "../managers/PrefManager";

const { ccclass } = cc._decorator;

/**
 * 基础模型类
 *
 * @export
 * @abstract
 * @class BaseModel
 */
@ccclass
export abstract class BaseModel {

    /**
     * 将信息存储到本地
     *
     * @memberof BaseModel
     */
    synchronize() {
        let synchronizeData = this.dataForSynchronize();
        let synchronizeString = JSON.stringify(synchronizeData);
        GameManager.getManager(PrefManager).setString(this.synchronizeKey, synchronizeString);
    }

    protected awakeFromDisk() {
        let synchronizeString = GameManager.getManager(PrefManager).getString(this.synchronizeKey, '{}');
        let synchronizeData = JSON.parse(synchronizeString);
        this.fromDiskJSON(synchronizeData);
    }

    protected get synchronizeKey(): string {
        return '';
    };

    protected dataForSynchronize(): any {
        return {};
    };

    protected fromDiskJSON(json: any) { };
}
