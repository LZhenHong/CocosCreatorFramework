/**
 * 游戏中的 Scene 名称
 *
 * @export
 * @enum {string}
 */
export enum Scene {
    Login = 'Login',
    Game = 'Game'
}

/**
 * View 展示的 Animation 类型
 *
 * @enum {number}
 */
export enum ViewAnimationEnum {
    Default = 0,
    LeftSlide = 1,
    Scale = 2
};
cc.Enum(ViewAnimationEnum);

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
cc.Enum(ViewLayerEnum);
