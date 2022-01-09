import Button from "../../component/Button";
import { ButtonClickEvent } from "../../const/Const";
import SDKManager from "../../managers/SDKManager";
import { RewardAdSpot } from "./AdSDKParameter";
import { WatchAdCompleteParamters } from "./IAdSDKAgent";

const { ccclass, property, disallowMultiple, menu } = cc._decorator;

@ccclass
@disallowMultiple
@menu('Framework/AdButton')
export default class AdButton extends Button {
    @property({ type: RewardAdSpot, displayName: '游戏内广告点' })
    spot = RewardAdSpot.None;

    @property({ override: true })
    isPreventDoubleClick = true;

    onLoad() {
        this.node.on(ButtonClickEvent, this.onAdButtonHandle, this);
    }

    success: (adSpot: RewardAdSpot) => void;
    failure: (adSpot: RewardAdSpot) => void;
    onAdButtonHandle() {
        if (this.spot == RewardAdSpot.None) {
            return;
        }

        SDKManager.Ad.showRewardAd(this.spot, (isSuccess: boolean, params: WatchAdCompleteParamters) => {
            if (isSuccess) {
                this.success && this.success(this.spot);
            } else {
                this.failure && this.failure(this.spot);
            }
        });
    }
}
