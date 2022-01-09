import ViewDefaultAnimator from "./ViewDefaultAnimator";
const { ccclass } = cc._decorator;

@ccclass('ViewLeftSlideAnimator')
export default class ViewLeftSlideAnimator extends ViewDefaultAnimator {

    private originX: number = 0;

    override onInit() {
        this.originX = this.animationNode.x;
    }

    override createShowTween(): cc.Tween | null {
        return cc.tween()
            .to(0.2, { x: this.originX }, { easing: 'backOut' });
    }

    override createHideTween(): cc.Tween | null {
        let canvasSize = cc.view.getCanvasSize();
        let animationX = this.originX + canvasSize.width;
        return cc.tween()
            .to(0.1, { x: animationX });
    }

    override resetBeforeTween() {
        let canvasSize = cc.view.getCanvasSize();
        this.animationNode.x = this.originX - canvasSize.width;
    }

}
