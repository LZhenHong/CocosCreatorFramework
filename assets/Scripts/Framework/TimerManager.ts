import { _decorator, Node } from 'cc';
import { BaseManager } from './Utility/BaseManager';

export class TimeManager extends BaseManager {
    protected onInit() {}

    protected onDestroy() {}

    private _root: Node|null = null;

    public initWithGameRoot(root: Node) {
        this._root = root;
    }
}
