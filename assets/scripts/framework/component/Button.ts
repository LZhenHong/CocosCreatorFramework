import { ButtonClickEvent } from "../const/Const";
import GameManager from "../GameManager";
import AudioManager from "../managers/AudioManager";

const { ccclass, property, disallowMultiple, menu } = cc._decorator;

@ccclass
@disallowMultiple
@menu('Framework/Button')
export default class Button extends cc.Button {
    @property({ displayName: '播放按钮音效' })
    enableAudio = true;

    @property({ override: true, displayName: '点击缩放值' })
    zoomScale: number = 0.9;

    @property({ override: true })
    _N$transition: number = 3;

    @property({ displayName: '是否阻止第二次点击' })
    isPreventDoubleClick = false;

    @property({ displayName: '阻止第二次点击时间间隔' })
    preventTime: number = 1;

    start() {
        this.node.on(ButtonClickEvent, this.onButtonHandle, this);
    }

    onButtonHandle() {
        if (this.enableAudio) {
            GameManager.getManager(AudioManager).playAudio('button');
        }

        if (this.isPreventDoubleClick) {
            this.interactable = false;
            this.scheduleOnce(() => {
                this.interactable = true;
            }, this.preventTime);
        }
    }

    onDisable() {
        this.interactable = true;
    }

}
