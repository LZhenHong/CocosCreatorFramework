import { ButtonClickEvent } from "../const/Const";
import AnimationComplete from "./AnimationComplete";

const { ccclass, requireComponent, menu } = cc._decorator;

export type SwitchStateChangeFunction = (on: boolean) => void;

@ccclass
@requireComponent(cc.Button)
@requireComponent(cc.Animation)
@requireComponent(AnimationComplete)
@menu('Framework/Switch')
export default class Switch extends cc.Component {

    public onSwitchStateChanged: SwitchStateChangeFunction;

    private _isSwitchOn: boolean = false;
    set switchOn(on: boolean) {
        this._isSwitchOn = on === true;
        this.playSwitchAnimation();
    }
    get switchOn(): boolean {
        return this._isSwitchOn;
    }

    private _isAnimating: boolean = false;
    private animation: cc.Animation = null;
    private animationComplete: AnimationComplete = null;
    onLoad() {
        this.animation = this.getComponent(cc.Animation);
        this.animationComplete = this.getComponent(AnimationComplete);
        this.animationComplete.completion = this.onAnimationCompleted;
        this.node.on(ButtonClickEvent, this.onSwitchButtonHandle, this);
    }

    onSwitchButtonHandle() {
        if (this._isAnimating) {
            return;
        }
        this._isSwitchOn = !this._isSwitchOn;
        this.playSwitchAnimation();
    }

    onEnable() {
        this.playSwitchAnimation();
    }

    playSwitchAnimation() {
        this.animation.stop();
        this.animation.play(this._isSwitchOn ? 'switch_on' : 'switch_off');
        this._isAnimating = true;
    }

    onAnimationCompleted() {
        this._isAnimating = false;
        this.onSwitchStateChanged && this.onSwitchStateChanged(this._isSwitchOn);
    }

}
