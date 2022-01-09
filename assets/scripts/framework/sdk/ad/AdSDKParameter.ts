import SDKParameter from "../SDKParameter";
import { AdCloseViewTrigger, AdLevelViewTrigger, AdOpenViewTrigger, AdPassLevelTrigger, AdViewTrigger } from "./AdTrigger";
const { property, ccclass } = cc._decorator;

export enum RewardAdSpot {
    None = 0,
};
cc.Enum(RewardAdSpot);

export enum AdChannel {
    Default = 0,
};
cc.Enum(AdChannel);

@ccclass('AdSDKParameter')
export default class AdSDKParameter extends SDKParameter {
    @property({ type: AdChannel, displayName: 'Ad Channel' })
    public channel = AdChannel.Default;

    @property({ type: [AdPassLevelTrigger] })
    levelTriggers: AdPassLevelTrigger[] = [];

    @property({ type: [AdLevelViewTrigger] })
    levelViewTriggers: AdLevelViewTrigger[] = [];

    @property({ type: [AdViewTrigger] })
    viewTriggers: AdViewTrigger[] = [];

    @property({ type: [AdCloseViewTrigger] })
    closeViewTriggers: AdCloseViewTrigger[] = [];

    @property({ type: [AdOpenViewTrigger] })
    openViewTriggers: AdOpenViewTrigger[] = [];
}
