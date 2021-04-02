import { Component } from "cc";

export default class Singleton extends Component {
    private static _instance: Singleton;

    public static sharedInstance() {
        if (!this._instance) {
            this._instance = new this;
        }
        return this._instance;
    }
}
