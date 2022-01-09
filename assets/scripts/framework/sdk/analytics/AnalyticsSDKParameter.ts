import SDKParameter from "../SDKParameter";
const { property, ccclass } = cc._decorator;

export enum AnalyticsSpot {
    None = 0
};
cc.Enum(AnalyticsSpot);

export enum AnalyticsChannel {
    Default = 0
};
cc.Enum(AnalyticsChannel);

@ccclass('AnalyticsSDKParameter')
export default class AnalyticsSDKParameter extends SDKParameter {
    @property({ type: AnalyticsChannel, displayName: 'Analytics Channel' })
    public channel = AnalyticsChannel.Default;
}
