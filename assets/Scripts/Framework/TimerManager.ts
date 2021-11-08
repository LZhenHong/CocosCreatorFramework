import { _decorator, macro, Component } from 'cc';
import { BaseManager } from './Utility/BaseManager';

/// 无效的 Timer handler
export const TIMER_HANDLER_INVALID = 0;

export class TimerManager extends BaseManager {
    private _timer: Component | null = null;

    private _handler = 0;
    private _callbackMap: Map<number, Function> = new Map();

    protected onInit() {
        this._handler = 0;
        this._callbackMap.clear();
    }

    public setupTimer(timer: Component) {
        this._timer = timer;
    }

    private _getNextHandler() {
        return ++this._handler;
    }

    /**
     * 下一帧执行回调
     *
     * @param {Function} callback 需要执行的回调
     * @return {number} 回调句柄
     * @memberof TimerManager
     */
    public nextFrameCall(callback: Function): number {
        return this.delayCall(0, callback);
    }

    /**
     * 延迟执行回调
     *
     * @param {number} delayDuration 延迟时间
     * @param {Function} callback 需要执行的回调
     * @return {number} 回调句柄
     * @memberof TimerManager
     */
    public delayCall(delayDuration: number, callback: Function): number {
        delayDuration = Math.max(delayDuration, 0);
        if (this._timer) {
            let handler = this._getNextHandler();
            let func = () => {
                this._cancelInternal(handler);
                callback();
            };
            this._callbackMap.set(handler, func);
            this._timer.scheduleOnce(func, delayDuration);
            return handler;
        }
        return 0;
    }

    /**
     * 多次执行的回调，没有延迟
     *
     * @param {number} repeatCount 多次执行的次数
     * @param {number} loopInterval 执行回调时间间隔
     * @param {Function} callback 需要执行的回调
     * @return {number} 回调句柄
     * @memberof TimerManager
     */
    public repeatCallWithoutDelay(repeatCount: number, loopInterval: number, callback: Function): number {
        return this.repeatCall(0, repeatCount, loopInterval, callback);
    }

    /**
     * 多次执行的回调
     *
     * @param {number} delayDuration 延迟时间
     * @param {number} repeatCount 多次执行的次数
     * @param {number} loopInterval 执行回调时间间隔
     * @param {Function} callback 需要执行的回调
     * @return {number} 回调句柄
     * @memberof TimerManager
     */
    public repeatCall(delayDuration: number, repeatCount: number, loopInterval: number, callback: Function): number {
        if (repeatCount <= 0) {
            return 0;
        }

        if (this._timer) {
            let handler = this.loopCallUntil(delayDuration, loopInterval, callback, function (count: number): boolean {
                return count >= repeatCount;
            });
            return handler;
        }
        return 0;
    }

    /**
     * 循环调用，直到某个条件满足就退出
     * 无延迟
     *
     * @param {number} loopInterval 执行回调时间间隔
     * @param {Function} callback 需要执行的回调
     * @param {(count: number) => boolean} stopFunction 停下循环的判断条件
     * @return {*}  {number} 回调句柄
     * @memberof TimerManager
     */
    public loopCallUntilWithDelay(loopInterval: number, callback: Function, stopFunction: (count: number) => boolean): number {
        return this.loopCallUntil(0, loopInterval, callback, stopFunction);
    }

    /**
     * 循环调用，直到某个条件满足就退出
     *
     * @param {number} loopInterval 执行回调时间间隔
     * @param {Function} callback 需要执行的回调
     * @param {(count: number) => boolean} stopFunction 停下循环的判断条件
     * @return {*}  {number} 回调句柄
     * @memberof TimerManager
     */
    public loopCallUntil(delayDuration: number, loopInterval: number, callback: Function, stopFunction: (count: number) => boolean): number {
        delayDuration = Math.max(delayDuration, 0.0001);
        if (this._timer) {
            let handler = this._getNextHandler();
            let count = 0;
            let func = () => {
                if (stopFunction(count)) {
                    this.cancel(handler);
                    return;
                }
                callback();
                ++count;
            };
            this._callbackMap.set(handler, func);
            this._timer.schedule(func, loopInterval, macro.REPEAT_FOREVER, delayDuration);
            return handler;
        }
        return 0;
    }

    /**
     * 没有延迟循环执行回调
     *
     * @param {number} loopInterval 循环时间间隔
     * @param {Function} callback 需要执行的回调
     * @return {number} 回调句柄
     * @memberof TimerManager
     */
    public loopCallWithoutDelay(loopInterval: number, callback: Function): number {
        return this.loopCall(0, loopInterval, callback);
    }

    /**
     * 可以延迟的循环执行回调
     *
     * @param {number} delayDuration 延迟时间
     * @param {number} loopInterval 循环时间间隔
     * @param {Function} callback 需要执行的回调
     * @return {number} 回调句柄
     * @memberof TimerManager
     */
    public loopCall(delayDuration: number, loopInterval: number, callback: Function): number {
        delayDuration = Math.max(delayDuration, 0.0001);
        if (this._timer) {
            let handler = this._getNextHandler();
            this._callbackMap.set(handler, callback);
            this._timer.schedule(callback, loopInterval, macro.REPEAT_FOREVER, delayDuration);
            return handler;
        }
        return 0;
    }

    /**
     * 取消延迟执行回调
     *
     * @param {number} handler 取消回调的句柄
     * @memberof TimerManager
     */
    public cancel(handler: number) {
        if (this._timer && this.isTimerRunning(handler)) {
            let func = this._callbackMap.get(handler);
            if (func !== undefined) {
                this._timer.unschedule(func);
            }
            this._cancelInternal(handler);
        }
    }

    private _cancelInternal(handler: number) {
        if (this._callbackMap.has(handler)) {
            this._callbackMap.delete(handler);
        }
    }

    /**
     * 取消当前所有的延迟回调
     *
     * @memberof TimerManager
     */
    public cancelAll() {
        if (this._timer) {
            this._timer.unscheduleAllCallbacks();
        }
        this._callbackMap.clear();
        this._handler = 0;
    }

    /**
     * 判断 Timer 的句柄是否有效
     *
     * @param {number} handler 回调句柄
     * @return {boolean} 是否有效
     * @memberof TimerManager
     */
    public isTimerValid(handler: number): boolean {
        return handler !== TIMER_HANDLER_INVALID;
    }

    /**
     * 判断 Timer 是否正在运行
     * 延迟回调在等待期间返回 true
     * 循环回调在等待和执行期间都返回 true
     *
     * @param {number} handler 回调句柄
     * @return {boolean} 是否正在运行
     * @memberof TimerManager
     */
    public isTimerRunning(handler: number): boolean {
        return this.isTimerValid(handler) && this._callbackMap.has(handler);
    }

    /**
     * 立马执行回调一次，然后取消回调
     *
     * @waring 如果是多次或者循环执行的回调，执行一次就退出，不会执行多次
     * @param {number} handler 回调句柄
     * @return {boolean} 是否成功执行回调
     * @memberof TimerManager
     */
    public excuteOnce(handler: number): boolean {
        if (this.isTimerRunning(handler)) {
            let func = this._callbackMap.get(handler);
            this.cancel(handler);
            if (func !== undefined) {
                func();
                return true;
            }
            return false;
        }
        return false;
    }

    protected onDestroy() {
        this.cancelAll();
    }
}
