import { _decorator, Enum } from 'cc';

/**
 * 游戏中的 Scene 名称
 *
 * @export
 * @enum {string}
 */
export enum Scene {
    Main = 'main'
}

/**
 * View 展示的 Animation 类型
 *
 * @enum {number}
 */
export enum ViewAnimationEnum {
    None = 0,
    LeftSlide = 1,
    Scale = 2
};
Enum(ViewAnimationEnum);

/**
 * View 展示的层级类型
 *
 * @enum {number}
 */
export enum ViewLayerEnum {
    Content = 10,
    Popup = 20,
    Guide = 30,
    Top = 40
};
Enum(ViewLayerEnum);

/**
 * 组件执行顺序，默认是 0，越小越先执行
 *
 * @export
 * @enum {number}
 */
export enum ComponentExcuteOrder {
    Low = 20,
    Middle = 10,
    Default = 0,
    High = -10,
    Top = -20
}
