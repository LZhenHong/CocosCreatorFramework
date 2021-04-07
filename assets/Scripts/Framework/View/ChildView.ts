import { _decorator } from 'cc';
import { BaseView } from './BaseView';
const { ccclass } = _decorator;

/**
 * 基础 ChildView 类
 *
 * @export
 * @abstract
 * @class ChildView
 */
@ccclass('ChildView')
export abstract class ChildView extends BaseView {

    public viewPrefabPath(): string {
        throw new Error('Child View should not call -viewPrefabPath method.');
    }

}
