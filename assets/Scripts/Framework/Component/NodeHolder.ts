import { _decorator, Component, Node, Constructor } from 'cc';
const { ccclass, property, disallowMultiple, menu } = _decorator;

@ccclass('NodeHolder')
@disallowMultiple
@menu('Framework/NodeHolder')
export class NodeHolder extends Component {
    @property({type: [Node], tooltip: "需要访问的节点", displayName: "Node References"})
    public nodes: (Node|null)[] = [];

    private _nodeMap: Map<string, Node> = new Map();

    onLoad() {
        this._mapNodes();
    }

    _mapNodes() {
        this._nodeMap.clear();
        if (this.nodes.length > 0) {
            for (const node of this.nodes) {
                if (node === null) {
                    continue;
                }
                const name = node.name;
                this._nodeMap.set(name, node);
            }
        }
    }

    getComponentWithName<T extends Component>(name: string, componentClazz: Constructor<T>) {
        if (this._nodeMap.has(name)) {
            return this._nodeMap.get(name)!.getComponent(componentClazz);
        }
        return null;
    }

    resetInEditor() {
        this.nodes = [];
        this._nodeMap.clear();
    }
}
