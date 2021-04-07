import { _decorator, Button } from 'cc';
import { BaseView } from '../Framework/View/BaseView';
const { ccclass } = _decorator;

@ccclass('StartView')
export class StartView extends BaseView {
    private _playButton: Button|null = null;
    private _settingButton: Button|null = null;

    onInit() {
        this._playButton = this.getGameObjectWithName<Button>('play_button');
        this.addClickEventListener(this._playButton, this.onPlayButtonHandle);

        this._settingButton = this.getGameObjectWithName<Button>('setting_button');
        this.addClickEventListener(this._settingButton, this.onSettingButtonHandle);
    }
    
    onOpen() {}
    onClose() {}

    onDestroy() {}

    onPlayButtonHandle() {
        console.log("On Play Button Handle");
    }

    onSettingButtonHandle() {
        console.log("On Setting Button Handle");
    }
}
