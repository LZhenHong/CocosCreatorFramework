import ViewDefaultAnimator from "./ViewDefaultAnimator";
const { ccclass } = cc._decorator;

@ccclass('ViewScaleAnimator')
export default class ViewScaleAnimator extends ViewDefaultAnimator {

    override createShowTween(): cc.Tween | null {
        return cc.tween()
            .to(0.1, { scale: 1.1 })
            .to(0.05, { scale: 0.95 })
            .to(0.05, { scale: 1 });
    }

    override createHideTween(): cc.Tween | null {
        return cc.tween()
            .to(0.1, { scale: 0 });
    }

    override resetBeforeTween() {
        this.animationNode.scale = 0;
    }

}
