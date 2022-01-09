import { ActiveType } from "../const/Const";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('Framework/ActiveListener')
export default class ActiveListener extends cc.Component {
    @property({ type: [cc.Component.EventHandler], tooltip: 'View active 的监听', displayName: 'Active Event Handlers' })
    public activeHandlers: (cc.Component.EventHandler | null)[] = [];

    private get _validActiveHandlers() {
        let handlers: cc.Component.EventHandler[] = [];
        for (let handler of this.activeHandlers) {
            if (handler !== null) {
                handlers.push(handler);
            }
        }
        return handlers;
    }

    onEnable() {
        if (this._validActiveHandlers && this._validActiveHandlers.length > 0) {
            cc.Component.EventHandler.emitEvents(this._validActiveHandlers, this, true);
        }
        this.node.emit(ActiveType.Active, this);
    }

    onDisable() {
        if (this._validActiveHandlers && this._validActiveHandlers.length > 0) {
            cc.Component.EventHandler.emitEvents(this._validActiveHandlers, this, false);
        }
        this.node.emit(ActiveType.Inactive, this);
    }
}
