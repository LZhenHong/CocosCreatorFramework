import { RewardAdSpot } from "./AdSDKParameter";

export type WatchAdComplete = (isSuccess: boolean, parameters: WatchAdCompleteParamters) => void;

export class WatchAdCompleteParamters {
    public transId: string = '';
    public ecpm: number = 0;

    public static empty(): WatchAdCompleteParamters {
        return (new WatchAdCompleteParamters());
    }
}

export default interface IAdSDKAgent {
    showRewardAd(spot: RewardAdSpot, complete: WatchAdComplete): void;
    showRewardAdFailed(spot: RewardAdSpot): void;
    isRewardAdReady(spot: RewardAdSpot): boolean;

    showNativeAd(complete: WatchAdComplete): void;
    hideNativeAd(): void;
    isNativeAdReady(): boolean

    showFullInterAd(complete: WatchAdComplete): void;
    isFullInterAdReady(): boolean;

    showInterAd(complete: WatchAdComplete):void;
    isInterAdReady():boolean;
}
