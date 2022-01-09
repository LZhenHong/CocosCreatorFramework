import BaseView from './BaseView';
const { ccclass } = cc._decorator;

/**
 * 基础 ChildView 类
 *
 * @export
 * @abstract
 * @class ChildView
 */
@ccclass
export abstract class ChildView extends BaseView {

    public initWithNode(node: cc.Node) {
        super.vm_init(node);
    }

    get viewPrefabPath(): string {
        throw new Error('Child View should not call -viewPrefabPath method.');
    }

    protected onOpen() { }
    protected onClose() { }

}
