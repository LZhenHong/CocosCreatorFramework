import { GameUtility } from "../../utility/GameUtility";

const { ccclass, property } = cc._decorator;

export enum AdTriggerType {
    None = 0,
    Reward = 1,
    HalfInter = 2,
    FullInter = 3,
    Splash = 4,
    Native = 5,
    InterAd = 6,
    Banner = 7
};
cc.Enum(AdTriggerType);

@ccclass
export class AdTrigger {
    @property({ type: AdTriggerType })
    adTriggerType: AdTriggerType = AdTriggerType.None;

    @property({ displayName: '触发概率', step: 1 })
    rate: number = 20;

    @property({ displayName: '最小触发延迟时间', step: 0.1 })
    minDelay: number = 0;

    @property({ displayName: '最大触发延迟时间', step: 0.1 })
    maxDelay: number = 0;

    get delay(): number {
        let delay = this.maxDelay - this.minDelay;
        return Math.random() * delay + this.minDelay;
    }

    readonly uuid: string = GameUtility.UUID();

    delayTimer: number = 0;
}

@ccclass('AdPassLevelTrigger')
export class AdPassLevelTrigger extends AdTrigger {
    @property({ displayName: '最小触发关卡', step: 1 })
    minLevel: number = 0;

    @property({ displayName: '最大触发关卡', step: 1 })
    maxLevel: number = 0;

    isInLevelSection(level: number): boolean {
        return level >= this.minLevel && level < this.maxLevel;
    }
}

@ccclass('AdViewTrigger')
export class AdViewTrigger extends AdTrigger {
    @property({ displayName: '触发界面' })
    viewName: string = '';
}

@ccclass('AdLevelViewTrigger')
export class AdLevelViewTrigger extends AdPassLevelTrigger {
    @property({ displayName: '触发界面' })
    viewName: string = '';
}

export class BaseAdViewTrigger extends AdTrigger {

    @property({ type: [cc.String], displayName: '触发界面' })
    viewNames: string[] = [];

    @property({ type: [cc.Integer], displayName: '没有观看激励视频的触发序列' })
    notWatchRewardAdSequences: number[] = [];

    @property({ type: [cc.Integer], displayName: '观看激励视频的触发序列' })
    watchRewardAdSequences: number[] = [];

    includeView(viewName: string) {
        return (this.viewNames.indexOf(viewName) >= 0);
    }
}

@ccclass('AdCloseViewTrigger')
export class AdCloseViewTrigger extends BaseAdViewTrigger { }

@ccclass('AdOpenViewTrigger')
export class AdOpenViewTrigger extends BaseAdViewTrigger { }
