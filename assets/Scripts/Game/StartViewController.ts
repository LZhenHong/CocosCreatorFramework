import { _decorator } from 'cc';
import { BaseViewController } from '../Framework/Controller/BaseViewController';
import { StartView } from './StartView';
const { ccclass } = _decorator;

@ccclass('StartViewController')
export class StartViewController extends BaseViewController<StartView> {

    protected onInit(): void {}

    protected onDestroy(): void {}

    protected onGameStart(): void {}

}
