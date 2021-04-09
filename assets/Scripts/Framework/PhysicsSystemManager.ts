import { _decorator, PhysicsSystem2D, EPhysics2DDrawFlags, v2, PHYSICS_2D_PTM_RATIO } from 'cc';
import { BaseManager } from './Utility/BaseManager';
const { ccclass } = _decorator;

@ccclass('PhysicsSystemManager')
export class PhysicsSystemManager extends BaseManager {
    enable() {
        PhysicsSystem2D.instance.enable = true;
    }

    disable() {
        PhysicsSystem2D.instance.enable = false;
    }

    enableDebugDrawFlags() {
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
        EPhysics2DDrawFlags.Pair |
        EPhysics2DDrawFlags.CenterOfMass |
        EPhysics2DDrawFlags.Joint |
        EPhysics2DDrawFlags.Shape;
    }

    disableDebugDrawFlags() {
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.None;
    }

    setPhysicsGravity(gravity: number) {
        PhysicsSystem2D.instance.gravity = v2(0, gravity * PHYSICS_2D_PTM_RATIO);
    }

    emptyPhysicsGravity() {
        PhysicsSystem2D.instance.gravity = v2();
    }

    onInit() {
        this.disable();
    }

    onUpdate(deltaTime: number) {}

    onLateUpdate(deltaTime: number) {}

    onDestroy() {

    }
}
