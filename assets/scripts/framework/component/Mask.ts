import { ButtonClickEvent } from "../const/Const";

const { ccclass, requireComponent, menu } = cc._decorator;

@ccclass
@menu('Framework/Mask')
@requireComponent(cc.Button)
export default class Mask extends cc.Component {

    hideOnClick = false;
    clickHandler: Function;

    onLoad() {
        this.node.on(ButtonClickEvent, this.onButtonClick.bind(this));
    }

    onButtonClick() {
        if (this.hideOnClick) {
            this.clickHandler && this.clickHandler();
        }
    }

}
