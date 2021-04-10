import { _decorator, Button } from 'cc';
import { BaseView } from '../Framework/View/BaseView';
const { ccclass } = _decorator;

@ccclass('StartView')
export class StartView extends BaseView {
    private _playButton: Button|null = null;
    private _settingButton: Button|null = null;

    protected onInit() {
        this._playButton = this.getComponentWithName('play_button', Button);
        this.addClickEventListener(this._playButton, this.onPlayButtonHandle);

        this._settingButton = this.getComponentWithName('setting_button', Button);
        this.addClickEventListener(this._settingButton, this.onSettingButtonHandle);
    }

    protected onOpen() {}
    protected onClose() {}

    protected onPause() {}
    protected onResume() {}

    protected onDestroy() {}

    onPlayButtonHandle() {
        console.log("On Play Button Handle");
    }

    onSettingButtonHandle() {
        console.log("On Setting Button Handle");
    }
}
