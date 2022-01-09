import ObjectHolder from "./ObjectHolder";

const { ccclass, property, disallowMultiple, menu } = cc._decorator;

@ccclass
@disallowMultiple
@menu('Framework/SpriteHolder')
export default class SpriteHolder extends ObjectHolder<cc.SpriteFrame> {
    /**
     * 直接用 cc.Asset 引用 SpriteFrame 取不到名称
     *
     * @type {((cc.SpriteFrame | null)[])}
     * @memberof SpriteHolder
     */
    @property({ type: [cc.SpriteFrame], tooltip: "需要访问的图片资源", displayName: "Sprite References" })
    public sprites: (cc.SpriteFrame | null)[] = [];

    getSpriteWithName(name: string): cc.SpriteFrame {
        let asset = this.getObjectWithName(name);
        return asset as cc.SpriteFrame;
    }

    objectsForMap(): cc.SpriteFrame[] {
        return this.sprites;
    }

    onReset() {
        this.sprites = [];
    }

}
