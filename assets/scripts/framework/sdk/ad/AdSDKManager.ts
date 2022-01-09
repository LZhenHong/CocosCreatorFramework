import GameManager from "../../GameManager";
import EventManager from "../../managers/EventManager";
import NetworkManager, { NetworkResponse } from "../../managers/NetworkManager";
import SDKManager from "../../managers/SDKManager";
import TimerManager from "../../managers/TimerManager";
import { Constructor } from "../../utility/GameUtility";
import { AnalyticsSpot } from "../analytics/AnalyticsSDKParameter";
import SDKAgent from "../SDKAgent";
import AdSDKParameter, { AdChannel, RewardAdSpot } from "./AdSDKParameter";
import { AdCloseViewTrigger, AdTrigger, AdTriggerType, AdViewTrigger } from "./AdTrigger";
import IAdSDKAgent, { WatchAdComplete, WatchAdCompleteParamters } from "./IAdSDKAgent";
import { BaseModel } from "../../model/BaseModel";
import JSBManager from "../../managers/JSBManager";
import { Event } from "../../const/Event";

export default class AdSDKManager implements IAdSDKAgent {

    public static instance = new AdSDKManager();

    private adSDKAgent: IAdSDKAgent = null;
    private adSDKParameter: AdSDKParameter = null;
    // 是否看过激励视频
    private hasWatachRewardAd: boolean = false;
    // 用来记录 Triggeer 被触发了多少次
    private triggerStrikeCount: Map<string, number> = new Map();
    // 用来记录 View 被关闭了多少次
    private closeViewCount: Map<string, number> = new Map();
    /**记录打开了多少次 */
    private openViewCount: Map<string , number> = new Map();

    setup(parameter: AdSDKParameter) {
        this.adSDKParameter = parameter;

        let clazzName = this.sdkAgentClazzNameForChannel(parameter.channel);
        let clazz = cc.js.getClassByName(clazzName) as Constructor<IAdSDKAgent>;
        if (clazz) {
            let instance = new clazz();
            if (instance instanceof SDKAgent) {
                let agent = instance as SDKAgent;
                agent.init(parameter);
            }
            this.adSDKAgent = instance;
        }

        GameManager.getManager(EventManager).addListener(Event.OpenView, this.onOpenView, this);
        GameManager.getManager(EventManager).addListener(Event.HideView, this.onHideView, this);
    }

    private sdkAgentClazzNameForChannel(channel: AdChannel): string {
        return `Ad${AdChannel[channel]}SDKAgent`;
    }

    public setUserId(userId: string) {
        if (this.adSDKAgent instanceof SDKAgent) {
            let agent = this.adSDKAgent as SDKAgent;
            agent.setUserId(userId);
        }
    }

    onPassLevel(level: number) {
        this.adSDKParameter.levelTriggers.forEach((trigger) => {
            if (trigger.isInLevelSection(level)) {
                this.strike(trigger);
            }
        });
    }

    strike(trigger: AdTrigger): boolean {
        let succ = false;

        let rate = Math.random();
        let rateLimit = trigger.rate / 100;
        if (rate <= rateLimit) {
            if (trigger.adTriggerType == AdTriggerType.FullInter) {
                succ = this.isFullInterAdReady();
            } else if (trigger.adTriggerType == AdTriggerType.Native) {
                succ = this.isNativeAdReady();
            } else if (trigger.adTriggerType == AdTriggerType.Banner) {
                // succ = this.isBannerAdReady();
            } else if (trigger.adTriggerType == AdTriggerType.InterAd){
                //半屏插屏
                succ = this.isInterAdReady();
            }

            let delay = trigger.delay;
            let func = () => {
                if (trigger.adTriggerType == AdTriggerType.FullInter) {
                    this.showFullInterAd();
                } else if (trigger.adTriggerType == AdTriggerType.Native) {
                    this.showNativeAd();
                } else if (trigger.adTriggerType == AdTriggerType.Banner) {
                    // this.showBannerAd();
                }else if (trigger.adTriggerType == AdTriggerType.InterAd){
                    //半屏插屏
                    this.showInterAd();
                    console.log("openViewTriggers3");
                }
            };
            if (delay > 0) {
                trigger.delayTimer = GameManager.getManager(TimerManager).delayCall(trigger.delay, func);
            } else {
                func();
            }
        }

        if (succ) {
            let strikeCount = this.triggerStrikeCount.get(trigger.uuid) ?? 0;
            this.triggerStrikeCount.set(trigger.uuid, strikeCount + 1);
        }
        return succ;
    }

    onOpenView(viewName: string) {
        this.adSDKParameter.viewTriggers.forEach((trigger) => {
            if (trigger.viewName === viewName) {
                this.strike(trigger);
            }
        });

        let level = 1;
        this.adSDKParameter.levelViewTriggers.forEach((trigger) => {
            if (trigger.viewName === viewName && trigger.isInLevelSection(level)) {
                this.strike(trigger);
            }
        });

        this.adSDKParameter.openViewTriggers.forEach((trigger) => {
            if(trigger.includeView(viewName)){
                let openCount = this.openViewCount.get(trigger.uuid);
                openCount = openCount ? openCount + 1: 1;
                this.openViewCount.set(trigger.uuid,openCount);

                let sequence = trigger.notWatchRewardAdSequences;
                let strikeCount = this.triggerStrikeCount.get(trigger.uuid) ?? 0;
                let index = strikeCount % sequence.length;
                let count = sequence[index];
                if(openCount >= count){
                    if(this.strike(trigger)){
                        this.openViewCount.set(trigger.uuid , 0);
                    }
                }
            }
        });
    }

    private onHideView(viewName: string) {
        let cancelTimer = (trigger: AdViewTrigger) => {
            if (trigger.viewName === viewName) {
                GameManager.getManager(TimerManager).cancel(trigger.delayTimer);
                trigger.delayTimer = 0;
            }
        };
        this.adSDKParameter.viewTriggers.forEach(cancelTimer);
        this.adSDKParameter.levelViewTriggers.forEach(cancelTimer);

        this.hideNativeAd();
        
        this.adSDKParameter.closeViewTriggers.forEach((trigger: AdCloseViewTrigger) => {
            if (trigger.includeView(viewName)) {
                let closeViewCount = this.closeViewCount.get(trigger.uuid);
                closeViewCount = closeViewCount ? closeViewCount + 1 : 1;
                this.closeViewCount.set(trigger.uuid, closeViewCount);

                let sequence = this.hasWatachRewardAd ? trigger.watchRewardAdSequences : trigger.notWatchRewardAdSequences;
                let strikeCount = this.triggerStrikeCount.get(trigger.uuid) ?? 0;
                let index = strikeCount % sequence.length;
                let count = sequence[index];
                if (closeViewCount >= count) {
                    if (this.strike(trigger)) {
                        this.closeViewCount.set(trigger.uuid, 0);
                    }
                }
            }
        });
    }

    private resetCloseViewRecordCount() {
        this.triggerStrikeCount.clear();
        this.closeViewCount.clear();
    }

    showRewardAd(spot: RewardAdSpot, complete: WatchAdComplete) {
        this.hasWatachRewardAd = true;
        this.resetCloseViewRecordCount();

        if (!cc.sys.isNative) {
            complete && complete(true, WatchAdCompleteParamters.empty());
            return;
        }

        if (this.isRewardAdReady(spot)) {
            let func = (isSuccess: boolean, params: WatchAdCompleteParamters) => {
                complete && complete(isSuccess, params);
            };
            this.adSDKAgent && this.adSDKAgent.showRewardAd(spot, func);
        } else {
            this.showRewardAdFailed(spot);
            complete && complete(false, WatchAdCompleteParamters.empty());
        }
    }

    showRewardAdFailed(spot: RewardAdSpot) {
        this.adSDKAgent && this.adSDKAgent.showRewardAdFailed(spot);
    }

    isRewardAdReady(spot: RewardAdSpot): boolean {
        return this.adSDKAgent && this.adSDKAgent.isRewardAdReady(spot);
    }

    showNativeAd(complete?: WatchAdComplete) {
        if (this.isNativeAdReady()) {
            this.adSDKAgent.showNativeAd(complete);
        } else {
            complete && complete(false, WatchAdCompleteParamters.empty());
        }
    }

    hideNativeAd() {
        if (this.adSDKAgent) {
            this.adSDKAgent.hideNativeAd();
        }
    }

    isNativeAdReady(): boolean {
        return this.adSDKAgent && this.adSDKAgent.isNativeAdReady();
    }

    showFullInterAd(complete?: WatchAdComplete) {
        if (this.isFullInterAdReady()) {
            let func = (isSuccess: boolean, params: WatchAdCompleteParamters) => {
                complete && complete(isSuccess, params);
            };
            this.adSDKAgent.showFullInterAd(func);
        } else {
            complete && complete(false, WatchAdCompleteParamters.empty());
        }
    }

    isFullInterAdReady(): boolean {
        return this.adSDKAgent && this.adSDKAgent.isFullInterAdReady();
    }

    showInterAd(complete?: WatchAdComplete){
        if(this.isInterAdReady()) {
            let func = (isSuccess : boolean , params : WatchAdCompleteParamters) =>{
                complete && complete(isSuccess , params);
            };

            this.adSDKAgent.showInterAd(func);
        }
    }

    isInterAdReady() : boolean {
        return this.adSDKAgent && this.adSDKAgent.isInterAdReady();
    }
}
