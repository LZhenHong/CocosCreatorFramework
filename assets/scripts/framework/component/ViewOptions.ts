import { ViewAnimationEnum, ViewLayerEnum } from '../const/Enum';

const { ccclass, property, disallowMultiple, menu } = cc._decorator;

@ccclass
@disallowMultiple
@menu('Framework/ViewOptions')
export default class ViewOptions extends cc.Component {
    @property({ tooltip: "是否需要蒙板", displayName: "Show Mask" })
    public showMask: boolean = true;

    @property({ tooltip: '点击蒙板关闭界面', displayName: 'Hide When Click Mask' })
    public hideWhenClickMask = true;

    @property({ tooltip: "是否响应 Android 物理返回键", displayName: "Enable Android Back" })
    public enableAndroidBack: boolean = false;

    @property({ tooltip: "关闭界面时是否销毁", displayName: "Destroy When Close" })
    public destroyWhenClose: boolean = false;

    @property({ type: ViewAnimationEnum, tooltip: "界面展示动画", displayName: "View Animation" })
    public viewAnimation = ViewAnimationEnum.Default;

    @property({ type: ViewLayerEnum, tooltip: '界面层级', displayName: 'View Layer' })
    public viewLayer = ViewLayerEnum.Content;

    resetInEditor() {
        this.showMask = true;
        this.hideWhenClickMask = true;
        this.enableAndroidBack = false;
        this.destroyWhenClose = false;
        this.viewAnimation = ViewAnimationEnum.Default;
        this.viewLayer = ViewLayerEnum.Content;
    }
}
