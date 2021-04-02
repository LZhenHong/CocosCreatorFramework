import { _decorator, Component, Node, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StartView')
export class StartView extends Component {
    @property({type: Button})
    public playButton : Button|null = null;
    @property({type: Button})
    public settingButton: Button|null = null;

    onPlayButtonHandle() {
        console.log("On Play Button Handle");
    }

    onSettingButtonHandle() {
        console.log("On Setting Button Handle");
    }
}
