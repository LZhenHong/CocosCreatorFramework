import { Component, EventHandler, _decorator } from 'cc';
const { ccclass, property } = _decorator;

export enum ActiveType {
    Active = 'active',
    Inactive = 'inactive'
}

@ccclass('ActiveListener')
export class ActiveListener extends Component {
    @property({type: [EventHandler], tooltip: 'View active 的监听', displayName: 'Active Event Handlers'})
    public activeHandlers: (EventHandler|null)[] = [];

    private get _validActiveHandlers() {
        var handlers: EventHandler[] = [];
        for (const handler of this.activeHandlers) {
            if (handler !== null) {
                handlers.push(handler);
            }
        }
        return handlers;
    }

    onEnable() {
        if (this._validActiveHandlers && this._validActiveHandlers.length > 0) {
            EventHandler.emitEvents(this._validActiveHandlers, this, true);
        }
        this.node.emit(ActiveType.Active, this);
    }

    onDisable() {
        if (this._validActiveHandlers && this._validActiveHandlers.length > 0) {
            EventHandler.emitEvents(this._validActiveHandlers, this, false);
        }
        this.node.emit(ActiveType.Inactive, this);
    }
}
