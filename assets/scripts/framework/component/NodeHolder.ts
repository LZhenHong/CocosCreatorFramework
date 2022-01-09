import { Constructor } from "../utility/GameUtility";
import ObjectHolder from "./ObjectHolder";

const { ccclass, property, disallowMultiple, menu } = cc._decorator;

@ccclass
@disallowMultiple
@menu('Framework/NodeHolder')
export default class NodeHolder extends ObjectHolder<cc.Node> {
    @property({ type: [cc.Node], tooltip: "需要访问的节点", displayName: "Node References" })
    public nodes: (cc.Node | null)[] = [];

    objectsForMap(): cc.Node[] {
        return this.nodes;
    }

    getNodeWithName(name: string): cc.Node {
        return this.getObjectWithName(name);
    }

    getComponentWithName<T extends cc.Component>(name: string, componentClazz: Constructor<T>): T | null {
        let node = this.getNodeWithName(name);
        if (node) {
            return node.getComponent(componentClazz);
        }
        return null;
    }

    onReset() {
        this.nodes = [];
    }

}
