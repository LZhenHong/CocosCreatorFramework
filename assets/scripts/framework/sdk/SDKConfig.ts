import AdSDKParameter from "./ad/AdSDKParameter";
import AnalyticsSDKParameter from "./analytics/AnalyticsSDKParameter";
import LoginSDKParameter from "./login/LoginSDKParameter";

const { ccclass, property, disallowMultiple, menu } = cc._decorator;

export enum GameChannel {
    ORIGINAL = 0,
}
cc.Enum(GameChannel);

@ccclass
@disallowMultiple
@menu('Framework/SDKConfig')
export default class SDKConfig extends cc.Component {
    @property({ type: GameChannel, displayName: '渠道' })
    public channel: GameChannel = GameChannel.ORIGINAL;

    @property({ type: [LoginSDKParameter], displayName: 'Login SDK Parameters' })
    public loginSDKParameters: LoginSDKParameter[] = [];

    @property({ type: [AnalyticsSDKParameter], displayName: 'Analytics SDK Parameters' })
    public analyticsSDKParameters: AnalyticsSDKParameter[] = [];

    @property({ type: AdSDKParameter, displayName: 'Ad SDK Parameter' })
    public adSDKParameter: AdSDKParameter = null;

    get channelString(): string {
        return GameChannel[this.channel];
    }
}
