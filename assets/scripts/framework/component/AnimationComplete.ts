const { ccclass, requireComponent, menu } = cc._decorator;

/**
 * 动画系统会搜索动画根节点中的所有组件
 * 如果组件中有实现动画事件中指定的函数的话，就会对它进行调用
 *
 * @export
 * @class AnimationComplete
 * @extends {cc.Component}
 */
@ccclass
@menu('Framework/AnimationComplete')
@requireComponent(cc.Animation)
export default class AnimationComplete extends cc.Component {

    public completion: Function;

    public onAnimationCompleted() {
        if (this.completion) {
            this.completion();
        }
    }

}
