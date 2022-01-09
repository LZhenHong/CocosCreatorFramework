export type Constructor<T = {}> = new (...args: any[]) => T;

// https://blog.csdn.net/RICKShaozhiheng/article/details/87922938
// Cocos Creator TS 类混淆之后就取不到原有的类名
// 自定义一个修饰器，用于取到原类名
export function ViewControllerClass(target: any) {
    let frameInfo = cc['_RF'].peek();
    let script = frameInfo.script;
    cc.js.setClassName(script, target);
}

export abstract class GameUtility {

    /**
     * 将驼峰的命名转换成下划线格式
     *
     * @example ExampleCamelCase 会被转换成 example_camel_case
     * @static
     * @param {string} camelCase
     * @returns
     * @memberof GameUtility
     */
    public static camelCaseToUnderScore(camelCase: string) {
        let re = /[A-Z]/;
        let index = camelCase.search(re);
        while (index !== -1) {
            let firstStr = camelCase.substring(0, index);
            let lastStr = camelCase.substring(index);
            let firstChar = lastStr.charAt(0).toLocaleLowerCase();
            lastStr = '_' + firstChar + lastStr.substring(1);
            camelCase = firstStr.concat(lastStr);
            index = camelCase.search(re);
        };

        if (camelCase.startsWith('_')) {
            camelCase = camelCase.substring(1);
        }
        return camelCase;
    }

    /**
     * 生成唯一标识符
     *
     * @static
     * @returns {string}
     * @memberof GameUtility
     */
    public static UUID(): string {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    }

    /**
     * 是否是原生平台
     *
     * @static
     * @returns {boolean}
     * @memberof GameUtility
     */
    public static isNativePlatform(): boolean {
        return cc.sys.isNative && (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS);
    }

    public static clamp(value: number, minValue: number, maxValue: number): number {
        return Math.min(Math.max(value, minValue), maxValue);
    }

    public static randomInt(minValue: number, maxValue?: number): number {
        let number = 0;
        if (maxValue === undefined || maxValue === null) {
            number = Math.floor(Math.random() * minValue);
        }

        if (maxValue >= minValue) {
            let range = maxValue - minValue;
            number = Math.floor(Math.random() * range) + minValue;
        }

        return number;
    }

    public static formatSeconds(seconds: number): string {
        var hour = Math.floor(seconds / 3600);
        var hourStr = hour < 10 ? "0" + hour : hour.toString();
        seconds -= hour * 3600;
        var minute = Math.floor(seconds / 60);
        var minuteStr = minute < 10 ? "0" + minute : minute.toString();
        seconds = Math.floor(seconds - minute * 60);
        var secondStr = seconds < 10 ? "0" + seconds : seconds.toString();

        var result = ""
        if (hour > 0) {
            result += (hourStr + ":")
        }
        return result + minuteStr + ":" + secondStr;
    }

}
