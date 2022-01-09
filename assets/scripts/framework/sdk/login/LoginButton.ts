import Button from "../../component/Button";
import { ButtonClickEvent } from "../../const/Const";
import SDKManager from "../../managers/SDKManager";
import { LoginChannel } from "./LoginSDKParameter";

const { ccclass, property, disallowMultiple, menu } = cc._decorator;

@ccclass
@disallowMultiple
@menu('Framework/LoginButton')
export default class LoginButton extends Button {
    @property({ type: LoginChannel, displayName: '登录渠道' })
    channel = LoginChannel.Default;

    onLoad() {
        this.node.on(ButtonClickEvent, this.onLoginButtonHandle, this);
    }

    success: (channel: LoginChannel, info: string) => void;
    failure: (channel: LoginChannel, info: string) => void;
    onLoginButtonHandle() {
        SDKManager.Login.login(this.channel, (isSuccess: boolean, info: string) => {
            if (isSuccess) {
                this.onLoginSuccess();
            } else {
                this.failure && this.failure(this.channel, info);
            }
        });
    }

    onLoginSuccess() {
        SDKManager.Login.getUserInfo(this.channel, (isSuccess: boolean, info: string) => {
            if (isSuccess) {
                this.success && this.success(this.channel, info);
            } else {
                this.failure && this.failure(this.channel, info);
            }
        });
    }

}
