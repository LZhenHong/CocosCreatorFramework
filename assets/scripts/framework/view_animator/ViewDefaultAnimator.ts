const { ccclass } = cc._decorator;

@ccclass('ViewDefaultAnimator')
export default class ViewDefaultAnimator {

    protected animationNode: cc.Node;
    public init(node: cc.Node) {
        this.animationNode = node;
    }

    public show(callback?: Function) {
        let tween = this.createShowTween();
        this.resetBeforeTween();
        if (tween) {
            cc.tween(this.animationNode)
                .then(tween)
                .call(() => {
                    this.onShowComplete(callback);
                })
                .start();
        } else {
            callback && callback();
        }
    }

    protected onShowComplete(callback?: Function) {
        callback && callback();
    }

    public hide(callback?: Function) {
        let tween = this.createHideTween();
        if (tween) {
            cc.tween(this.animationNode)
                .then(tween)
                .call(() => {
                    this.onHideComplete(callback);
                })
                .start();
        } else {
            callback && callback();
        }
    }

    protected onHideComplete(callback?: Function) {
        callback && callback();
    }

    protected createShowTween(): cc.Tween | null {
        return null;
    }

    protected createHideTween(): cc.Tween | null {
        return null;
    }

    protected onInit() { }
    protected resetBeforeTween() { }

}
