import AdSDKManager from "../sdk/ad/AdSDKManager";
import AnalyticsSDKManager from "../sdk/analytics/AnalyticsSDKManager";
import SDKConfig from "../sdk/SDKConfig";
import BaseManager from "../utility/BaseManager";

export default class SDKManager extends BaseManager {
    protected onInit() { }
    protected onDestroy() { }

    public static Analytics: AnalyticsSDKManager = AnalyticsSDKManager.instance;
    public static Ad: AdSDKManager = AdSDKManager.instance;

    public setupWithSDKConfig(sdkConfig: SDKConfig) {
        SDKManager.Analytics.setup(sdkConfig.analyticsSDKParameters);
        SDKManager.Ad.setup(sdkConfig.adSDKParameter);
    }

    public setUserId(userId: string) {
        SDKManager.Analytics.setUserId(userId);
        SDKManager.Ad.setUserId(userId);
    }
}
