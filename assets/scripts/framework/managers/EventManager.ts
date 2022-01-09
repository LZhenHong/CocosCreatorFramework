import BaseManager from "../utility/BaseManager";

class Event {
    name: string;
    customData: any;
}

class EventListener {
    handle: number;
    target: any;
    func: Function;

    strike(event: Event) {
        this.func.call(this.target, event.customData);
    }
}

export default class EventManager extends BaseManager {

    protected onInit() {
        this._eventListeners.clear();
        this._handle = 0;
    }
    protected onDestroy() { }

    private _eventListeners: Map<string, Map<number, EventListener>> = new Map();
    private _handle = 0;

    public dispatchEvent(eventName: string, customData?: any) {
        if (this._eventListeners.has(eventName)) {
            let eventListeners = this._eventListeners.get(eventName);
            let event = new Event();
            event.name = eventName;
            event.customData = customData;
            eventListeners.forEach((eventListener) => {
                eventListener.strike(event);
            });
        }
    }

    public addListener(event: string, listener: (args?: any) => void, target: any): number {
        let handleIndex = ++this._handle;
        let eventListener = new EventListener();
        eventListener.handle = handleIndex;
        eventListener.func = listener.bind(target);
        eventListener.target = target;

        let eventListeners = this._eventListeners.get(event) ?? new Map<number, EventListener>();
        eventListeners.set(handleIndex, eventListener);
        this._eventListeners.set(event, eventListeners);

        return handleIndex;
    }

    public removeListener(event: string, handle: number) {
        let eventListeners = this._eventListeners.get(event);
        if (eventListeners) {
            if (eventListeners.has(handle)) {
                eventListeners.delete(handle);
            }
        }
    }

}
