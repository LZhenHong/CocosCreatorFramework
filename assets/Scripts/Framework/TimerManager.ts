import { _decorator, Node } from 'cc';
import Singleton from "./Utility/Singleton";

export class TimeManager extends Singleton {
    private _root: Node|null = null;

    public initWithGameRoot(root: Node) {
        this._root = root;
    }
}
