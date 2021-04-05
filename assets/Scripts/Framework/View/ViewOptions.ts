import { _decorator, Component, Enum } from 'cc';
const { ccclass, property, disallowMultiple } = _decorator;

const _ViewAnimation = {
    None: 0,
    LeftSlide: 1,
    Scale: 2
};

const ViewAnimationEnum = Enum(_ViewAnimation);

@ccclass('ViewOptions')
@disallowMultiple
export class ViewOptions extends Component {
    @property({tooltip: "是否需要蒙板", displayName: "Show Mask"})
    public showMask: boolean = true;
    @property({tooltip: "是否响应 Android 物理返回键", displayName: "Enable Android Back"})
    public enableAndroidBack: boolean = false;
    @property({tooltip: "关闭界面时是否销毁", displayName: "Destroy When Close"})
    public destroyWhenClose: boolean = false;
    @property({type: ViewAnimationEnum, tooltip: "界面展示动画", displayName: "View Animation"})
    public viewAnimation = ViewAnimationEnum.None;

    resetInEditor() {
        this.showMask = false;
        this.enableAndroidBack = false;
        this.destroyWhenClose = false;
        this.viewAnimation = ViewAnimationEnum.None;
    }
}
