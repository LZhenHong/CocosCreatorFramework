import { AnalyticsSpot } from "./AnalyticsSDKParameter";

export default interface IAnalyticsSDKAgent {
    trackEvent(event: AnalyticsSpot): IAnalyticsSDKAgent;
    parameter(key: string, val: string | number | boolean): IAnalyticsSDKAgent;
    flush(): void;
}
