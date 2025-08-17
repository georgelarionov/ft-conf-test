import { MeshStandardMaterial } from 'three';
import { ModelView } from '../ModelView';

export class HighlightModel {
  private lastMaterial?: MeshStandardMaterial | null;
  private view: ModelView;

  private highlighted = false;
  public get IsHighlighted() { return this.highlighted; };

  constructor(view: ModelView) {
    this.view = view;
  }
  public remove() {
    if (this.lastMaterial == null) return;

    this.lastMaterial.color.set(this.lastMaterial.userData.material);
    // this.lastMaterial.emissive?.addScalar(-0.05);
    this.lastMaterial.needsUpdate = true;
    this.lastMaterial.userData.material = null;

    this.lastMaterial = null;

    this.highlighted = false;
  }

  public update(clean: boolean = false) {
    if (!this.view.Raycaster.HasResults) {
      this.remove();
      return;
    }
    
    const material = (this.view.Raycaster.Mesh.material as MeshStandardMaterial[])[0];
    if (this.lastMaterial !== material) {
      this.remove();

      material.userData.material = material.color.clone();
      if (this.view.Color)
        material.color?.set(this.view.Color);
      material.needsUpdate = true;

      this.lastMaterial = material;
      this.highlighted = true;
    }

    if (clean) {
      this.remove();
    }
  }
}
