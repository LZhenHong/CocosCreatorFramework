import GameManager from "../GameManager";
import TimerManager from "../managers/TimerManager";
import { GameUtility } from "../utility/GameUtility";

const { ccclass, property, disallowMultiple, menu, requireComponent } = cc._decorator;

@ccclass
@disallowMultiple
@requireComponent(cc.Label)
@menu('Framework/CountDownTimer')
export default class CountDownTimer extends cc.Component {

    @property({ displayName: '倒计时时间' })
    interval: number = 0;

    onTick: (interval: number) => void;
    onEnd: () => void;

    private label: cc.Label;
    private timer: number = 0;
    private countDownInterval: number = 0;

    start() {
        this.countDownInterval = this.interval;
        this.label = this.getComponent(cc.Label);
        this.label.string = GameUtility.formatSeconds(this.interval);
    }

    public play() {
        this.timer = GameManager.getManager(TimerManager).repeatCall(1, this.countDownInterval, 1, () => {
            --this.countDownInterval;
            this.label.string = GameUtility.formatSeconds(this.countDownInterval);
            
            if (this.countDownInterval <= 0) {
                this.onEnd && this.onEnd();
            } else {
                this.onTick && this.onTick(this.countDownInterval);
            }
        });
    }

    public stop() {
        this.stopTimer();
        this.countDownInterval = this.interval;
    }

    private stopTimer() {
        this.timer && GameManager.getManager(TimerManager).cancel(this.timer);
        this.timer = 0;
    }

    public pause() {
        this.stopTimer();
    }

    public resume() {
        this.play();
    }
}