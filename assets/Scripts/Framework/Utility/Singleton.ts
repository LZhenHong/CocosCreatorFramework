export default class Singleton {
    private static _instance: Singleton;

    public static sharedInstance(): any {
        if (!this._instance) {
            this._instance = new this;
        }
        return this._instance;
    }
}
