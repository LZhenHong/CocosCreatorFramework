const { ccclass } = cc._decorator;

@ccclass
export default abstract class ObjectHolder<T extends cc.Object> extends cc.Component {

    protected _objectMap: Map<string, T> = new Map();

    _mapObjects() {
        let objects = this.objectsForMap();
        this._objectMap.clear();
        if (objects.length > 0) {
            for (let object of objects) {
                if (object === null) {
                    continue;
                }
                let name = object.name;
                this._objectMap.set(name, object);
            }
        }
    }

    private mapObjectsIfCould() {
        let objects = this.objectsForMap();
        if (objects.length != this._objectMap.size) {
            this._mapObjects();
        }
    }

    protected getObjectWithName(name: string): T | null {
        this.mapObjectsIfCould();
        return this._objectMap.get(name) as T;
    }

    resetInEditor() {
        this._objectMap.clear();
    }

    abstract objectsForMap(): T[];
    abstract onReset(): void;

}
