import GameManager from "../../GameManager";
import JSBManager from "../../managers/JSBManager";
import { Constructor } from "../../utility/GameUtility";
import SDKAgent from "../SDKAgent";
import AnalyticsSDKParameter, { AnalyticsChannel, AnalyticsSpot } from "./AnalyticsSDKParameter";
import IAnalyticsSDKAgent from "./IAnalyticsSDKAgent";

export default class AnalyticsSDKManager implements IAnalyticsSDKAgent {
    public static instance = new AnalyticsSDKManager();

    public agents: IAnalyticsSDKAgent[] = [];

    setup(parameters: AnalyticsSDKParameter[]) {
        parameters.forEach((parameter: AnalyticsSDKParameter) => {
            let clazzName = this.sdkAgentClazzNameForChannel(parameter.channel);
            let clazz = cc.js.getClassByName(clazzName) as Constructor<IAnalyticsSDKAgent>;
            if (clazz) {
                let instance = new clazz();
                if (instance instanceof SDKAgent) {
                    let agent = instance as SDKAgent;
                    agent.init(parameter);
                }
                this.agents.push(instance);
            }
        });
    }

    private sdkAgentClazzNameForChannel(channel: AnalyticsChannel): string {
        return `Analytics${AnalyticsChannel[channel]}SDKAgent`;
    }

    public setUserId(userId: string) {
        this.agents.forEach((agent) => {
            if (agent instanceof SDKAgent) {
                let sdkAgent = agent as SDKAgent;
                sdkAgent.setUserId(userId);
            }
        });
    }

    trackEvent(event: AnalyticsSpot): IAnalyticsSDKAgent {
        this.agents.forEach(agent => agent.trackEvent(event));
        return this;
    }

    parameter(key: string, val: string | number | boolean): IAnalyticsSDKAgent {
        this.agents.forEach(agent => agent.parameter(key, val));
        return this;
    }

    flush() {
        this.agents.forEach(agent => agent.flush());
    }
}
