import { Vector3 } from 'three';
import * as THREE from 'three';
import { Raycaster } from './Raycaster';

export class RaycastIntersection extends Raycaster {
  private lastRaycast: number = 0;
  private raycastInterval: number = 0;
  public get HasResults() {
    return this.list.length > 0;
  }

  public get First() {
    return this.list[0];
  }
  public get Normal() {
    return this.First.face?.normal ?? new Vector3();
  }
  public get Mesh() {
    return this.First.object as THREE.Mesh;
  }
  public get Object() {
    return this.First.object as THREE.Object3D;
  }
  public get List() {
    return this.list;
  }

  private list: THREE.Intersection[] = [];

  public check(x: number, y: number): boolean {
    if (Date.now() - this.lastRaycast > this.raycastInterval) {
      this.list = this.makeRaycast(x, y);
      this.lastRaycast = Date.now();
      return true;
    }
    return false;
  }
}
