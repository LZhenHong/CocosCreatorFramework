import { _decorator, Component } from 'cc';
const { ccclass, property, disallowMultiple } = _decorator;

@ccclass('ViewHolder')
@disallowMultiple
export class ViewHolder extends Component {
    @property({type: [Component], tooltip: "需要访问的节点", displayName: "GameObject Refrences"})
    public gameObjects: (Component|null)[] = [];

    private _gameObjectMap: Map<string, Component> = new Map();

    onLoad() {
        this._mapGameObjects();
    }

    _mapGameObjects() {
        this._gameObjectMap.clear();
        if (this.gameObjects.length > 0) {
            for (let gameObject of this.gameObjects) {
                if (gameObject === null) {
                    continue;
                }
                let name = gameObject.name;
                this._gameObjectMap.set(name, gameObject);
            }
        }
    }

    getGameObjectWithName(name: string) {
        return this._gameObjectMap.get(name);
    }

    resetInEditor() {
        this.gameObjects = [];
        this._gameObjectMap.clear();
    }
}
