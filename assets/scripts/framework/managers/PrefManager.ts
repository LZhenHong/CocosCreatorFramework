import BaseManager from "../utility/BaseManager";

export default class PrefManager extends BaseManager {

    private prefCache: Map<string, any> = new Map();

    protected onInit() { }
    protected onDestroy() { }

    setString(key: string, value: string) {
        this._setData(key, value);
    }

    getString(key: string, defaultValue?: string) {
        defaultValue = defaultValue ?? "";
        return this._getData(key, defaultValue);
    }

    setInt(key: string, value: number) {
        value = value || 0;
        this._setData(key, value);
    };

    getInt(key: string, defaultValue?: number) {
        defaultValue = defaultValue ?? 0;
        let val = this._getData(key, defaultValue);
        return parseInt(val);
    }

    setBool(key: string, value: boolean) {
        value = value ?? false;
        if (value) {
            this.setInt(key, 1);
        } else {
            this.setInt(key, 0);
        }
    }

    getBool(key: string, defaultValue?: boolean) {
        defaultValue = defaultValue ?? false;
        let defaultIntValue = 0;
        if (defaultValue) {
            defaultIntValue = 1;
        }
        let intValue = this.getInt(key, defaultIntValue);
        return intValue > 0;
    }

    _setData<T>(key: string, value: T) {
        this.prefCache.set(key, value);
        console.log("set " + key + " -> " + value);

        cc.sys.localStorage.setItem(key, value);
    }

    _getData<T>(key: string, defaultValue: T): string {
        let val = this.prefCache.get(key);
        if (val === undefined || val === null) {
            val = cc.sys.localStorage.getItem(key);
            this.prefCache.set(key, val);
        }

        if ((val === undefined || val === null || val === "") && defaultValue !== null && defaultValue !== undefined) {
            val = defaultValue;
        }
        return val;
    }

    clearData(key: string) {
        this.prefCache.delete(key);
        cc.sys.localStorage.removeItem(key);
    }

    clearAll() {
        this.prefCache.clear();
        cc.sys.localStorage.clear();
    }

}
