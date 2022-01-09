import GameManager from "../../framework/GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainUI extends cc.Component {
    /// 游戏 UI 层级容器
    @property({ type: cc.Node, tooltip: 'UI 根节点', displayName: 'UI Root' })
    public uiRoot: cc.Node | null = null;
    @property({ type: cc.Node, tooltip: 'Content 的 UI 层级容器', displayName: 'Content UI Container' })
    public contentUIContainer: cc.Node | null = null;
    @property({ type: cc.Node, tooltip: 'Popup 的 UI 层级容器', displayName: 'Popup UI Container' })
    public popupUIContainer: cc.Node | null = null;
    @property({ type: cc.Node, tooltip: 'Guide 的 UI 层级容器', displayName: 'Guide UI Container' })
    public guideUIContainer: cc.Node | null = null;
    @property({ type: cc.Node, tooltip: 'Top 的 UI 层级容器', displayName: 'Top UI Container' })
    public topUIContainer: cc.Node | null = null;

    onLoad() {
        GameManager.instance.mainUI = this;
    }
}
