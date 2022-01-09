import SDKParameter from "../SDKParameter";
const { property, ccclass } = cc._decorator;

export enum LoginChannel {
    Default = 0,
};
cc.Enum(LoginChannel);

@ccclass('LoginSDKParameter')
export default class LoginSDKParameter extends SDKParameter {
    @property({ type: LoginChannel, displayName: 'Login Channel', visible: false })
    _channel = LoginChannel.Default;

    @property({ displayName: 'Description', readonly: true, editorOnly: true })
    description: string = '';

    @property({ type: LoginChannel, displayName: 'Login Channel' })
    get channel(): LoginChannel {
        return this._channel;
    };
    set channel(channel: LoginChannel) {
        this._channel = channel;
        this.description = this._$description;
    }

    private get _$description(): string {
        switch (this._channel) {
            case LoginChannel.Default:
                return '请选择登录渠道';
            default:
                return '';
        }
    }
}
