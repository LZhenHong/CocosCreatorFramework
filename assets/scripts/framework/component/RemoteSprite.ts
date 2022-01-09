const { ccclass, disallowMultiple, menu } = cc._decorator;

@ccclass
@disallowMultiple
@menu('Framework/RemoteSprite')
export default class RemoteSprite extends cc.Sprite {

    _urlPath: string = '';

    set urlPath(urlPath: string) {
        this._urlPath = urlPath;
        this._currentLoadingUrlMD5 = CryptoJS.MD5(this._urlPath).toString();

        if (this._urlPath == null || this._urlPath.length <= 0) {
            return;
        }
        this.startLoadRemote();
    }
    get urlPath(): string {
        return this._urlPath;
    }

    private _isLoadingRemote: boolean = false;
    private _loadRemoteComplete: boolean = false;
    private _currentLoadingUrlMD5: string = '';

    /**
     * 设置占位图片
     * 如果已经加载好远程图片，则不会设置占位图片
     *
     * @type {cc.SpriteFrame}
     * @memberof RemoteSprite
     */
    set placeHolder(spriteFrame: cc.SpriteFrame) {
        if (this._loadRemoteComplete) {
            return;
        }
        this.spriteFrame = spriteFrame;
    };

    startLoadRemote() {
        this.stopLoadRemote();

        this._isLoadingRemote = true;
        this._loadRemoteComplete = false;
        cc.assetManager.loadRemote<cc.Texture2D>(this._urlPath, { ext: '.png' }, (error, texture) => {
            if (!this._isLoadingRemote) {
                return;
            }
            if (!texture || error) {
                return;
            }

            let md5 = CryptoJS.MD5(texture.nativeUrl).toString();
            if (this._currentLoadingUrlMD5 != md5) {
                return;
            }

            this._loadRemoteComplete = true;
            let sprite = new cc.SpriteFrame(texture);
            this.spriteFrame = sprite;
        });
    }

    stopLoadRemote() {
        this._isLoadingRemote = false;
        this._loadRemoteComplete = false;
    }

}
