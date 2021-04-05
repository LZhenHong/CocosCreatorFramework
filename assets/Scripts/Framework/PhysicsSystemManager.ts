import { _decorator, PhysicsSystem } from 'cc';
import { BaseManager } from './Utility/BaseManager';
const { ccclass } = _decorator;

@ccclass('PhysicsSystemManager')
export class PhysicsSystemManager extends BaseManager {
    enable() {
        PhysicsSystem.instance.enable = true;
    }

    disable() {
        PhysicsSystem.instance.enable = false;
    }

    onInit() {
        
    }

    onDestroy() {

    }
}
