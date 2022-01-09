const { ccclass, property } = cc._decorator;

@ccclass
export default class BubbleAnimation extends cc.Component {

    @property({ displayName: 'Play On Load' })
    isPlaying = true;

    @property({ displayName: '缩放动画' })
    playScaleAnimation: boolean = true;

    @property({ displayName: '移动动画' })
    playMoveAnimation: boolean = true;

    private _originalPosition: cc.Vec3 = cc.Vec3.ZERO;
    private _originalScaleX: number = 1;
    private _originalScaleY: number = 1;
    onLoad() {
        this._originalPosition = this.node.position;
        this._originalScaleX = this.node.scaleX;
        this._originalScaleY = this.node.scaleY;
    }

    onEnable() {
        this.playAnimation();
    }

    onDisable() {
        this.stopAnimation();
    }

    play() {
        this.isPlaying = true;
        this.playAnimation();
    }

    private playAnimation() {
        this.stopAnimation();
        if (this.isPlaying) {
            let delay = Math.random();
            // move animation
            if (this.playMoveAnimation) {
                cc.tween(this.node)
                    // .delay(delay)
                    .repeatForever(cc.tween()
                        .to(1.5, { position: cc.v3(this._originalPosition.x, this._originalPosition.y + 15, this._originalPosition.z) })
                        .to(1.5, { position: this._originalPosition })
                    )
                    .start();
            }

            if (this.playScaleAnimation) {
                // scale animation
                let frameTime = 0.025;
                cc.tween(this.node)
                    // .delay(delay)
                    .repeatForever(cc.tween()
                        .to(frameTime, { scaleX: this._originalScaleX * 0.96, scaleY: this._originalScaleY * 1.04 }, { easing: 'sineInOut' })
                        .to(frameTime * 4, { scaleX: this._originalScaleX * 1.12, scaleY: this._originalScaleY * 0.96 }, { easing: 'sineInOut' })
                        .to(frameTime * 4, { scaleX: this._originalScaleX * 0.95, scaleY: this._originalScaleY * 1.02 }, { easing: 'sineInOut' })
                        .to(frameTime * 4, { scaleX: this._originalScaleX * 1.08, scaleY: this._originalScaleY * 0.98 }, { easing: 'sineInOut' })
                        .to(frameTime * 4, { scaleX: this._originalScaleX * 1.0, scaleY: this._originalScaleY * 1.0 }, { easing: 'sineInOut' })
                        .to(frameTime * 4, { scaleX: this._originalScaleX * 1.04, scaleY: this._originalScaleY * 0.99 }, { easing: 'sineInOut' })
                        .to(frameTime * 4, { scaleX: this._originalScaleX * 1.0, scaleY: this._originalScaleY * 1.0 }, { easing: 'sineInOut' })
                        .to(frameTime * 4, { scaleX: this._originalScaleX * 1.02, scaleY: this._originalScaleY * 0.99 }, { easing: 'sineInOut' })
                        .to(frameTime * 4, { scaleX: this._originalScaleX * 1.0, scaleY: this._originalScaleY * 1.0 }, { easing: 'sineInOut' })
                        .delay(1)
                    )
                    .start();
            }
        }
    }

    stop() {
        this.isPlaying = false;
        this.stopAnimation();
    }

    private stopAnimation() {
        cc.Tween.stopAllByTarget(this.node);
        this.resetNodeProperties();
    }

    private resetNodeProperties() {
        this.node.position = this._originalPosition;
        this.node.scaleX = this._originalScaleX;
        this.node.scaleY = this._originalScaleY;
    }

}
