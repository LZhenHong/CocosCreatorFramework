import { SettingVibratePrefKey } from "../const/Const";
import BaseManager from "../utility/BaseManager"
import PrefManager from "./PrefManager";

export default class JSBManager extends BaseManager {

    private _enabled: boolean = false;
    protected onInit() {
        this._enabled = typeof jsb !== 'undefined';
    }

    protected onDestroy() { }

    set isVibrateOn(on: boolean) {
        let mgr = this.gameManager.getManager(PrefManager);;
        mgr.setBool(SettingVibratePrefKey, on);
    }
    get isVibrateOn(): boolean {
        let mgr = this.gameManager.getManager(PrefManager);;
        return mgr.getBool(SettingVibratePrefKey, true);
    }

    /**
     * 手机震动
     *
     * @param {number} duration 秒数
     * @memberof JSBManager
     */
    public vibrate(duration: number) {
        if (this._enabled && this.isVibrateOn) {
            // @ts-ignore
            jsb.Device.vibrate(duration);
        }
    }

    /**
     * 复制文本到剪贴板
     *
     * @param {string} val
     * @memberof JSBManager
     */
    public copyTextToClipboard(val: string) {
        if (this._enabled) {
            // @ts-ignore
            jsb.copyTextToClipboard(`${val}`);
        }
    }

    public getChannel(): string {
        if (this._enabled) {
            return '';
        } else {
            return '';
        }
    }
}
