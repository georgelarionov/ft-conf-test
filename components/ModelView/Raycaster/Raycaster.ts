import * as THREE from 'three';
import { Camera, Intersection, Object3D } from 'three';

export interface IRaycastView {
  Rect: DOMRect;
  Camera: Camera;
  Model: Object3D;
}

export abstract class Raycaster {
  public raycaster: THREE.Raycaster = new THREE.Raycaster();
  protected mouse = new THREE.Vector2();

  protected view: IRaycastView;

  constructor(view: IRaycastView) {
    this.view = view;
    this.raycaster.layers.set(0);
  }

  protected makeRaycast(x: number, y: number): Intersection[] {
    const rect = this.view.Rect;

    this.mouse.x = ((x - rect.left) / (rect.right - rect.left)) * 2 - 1;
    this.mouse.y = -((y - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

    if (this.view.Camera != null) {
      this.raycaster.setFromCamera(this.mouse, this.view.Camera);
      
      this.raycaster.firstHitOnly = true;
      return this.raycaster.intersectObject(this.view.Model, true);
    }
    return [];
  }
}
