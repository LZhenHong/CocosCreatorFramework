const { property, ccclass } = cc._decorator;

@ccclass
export default class SDKParameter {
    @property({ displayName: 'Debug' })
    debug: boolean = false;

    @property({ displayName: 'App Id' })
    appId: string = '';

    @property({ displayName: 'App Key' })
    appKey: string = '';
}
