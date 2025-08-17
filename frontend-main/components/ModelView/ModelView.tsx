import React from 'react';
import * as THREE from 'three';
import {
  BufferGeometry,
  CanvasTexture,
  Color,
  Group,
  LoadingManager,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  RepeatWrapping,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,
} from 'three';
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from 'three-mesh-bvh';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {
  DefaultMaterialProps,
  MaterialProps,
  MaterialUse,
  Product,
} from '../../type';
import { PrintMapCanvas } from './PrintMap/PrintMapCanvas';
import { IRaycastView } from './Raycaster/Raycaster';
import { RaycastIntersection } from './Raycaster/RaycastIntersection';
import IRecordConfig from './Exports/Video/RecordConfig';
import { HighlightModel } from './Controls/HighlightModel';
import { EditMode, ModelViewProps } from './View/ModelView.types';

import s from './View/styles.module.css';
import { ThreeView } from './View/ThreeView';
import { eventsUtils } from '../../utils/eventsUtils';
import { ObjectControls } from './Controls/ObjectControls';
import { colors } from '../ColorSettings/helpers';
import { PrintMapItem } from './PrintMap/PrintMapItem';
import { FTProduct } from '../../utils/dbModels';
import { emitEvent } from '../../utils/WebWorker/initWebWorker';
import { texturesSamples } from "../TextureSettings/texturesSamples";
import { PRODUCT_PRICE } from 'utils/common';

interface PrintDataInfo {
  image: string;
  opacity: number;
  position: THREE.Vector2;
  rotation: THREE.Vector2;
  scale: THREE.Vector2;
  color?: string; // Цвет для SVG принтов
}

interface ModelStateInfo {
  name: string;
  price: number;
  prints: PrintDataInfo[];
  materials: MaterialInfo[];
}

interface MaterialInfo {
  // Mesh name
  name: string;
  // Material color in hex format (#RRGGBB)
  color?: string;
  // Diffuse map name from userData
  mapUrl?: string;
  // Material roughness value (0-1)
  roughness?: number;
  // Material metalness value (0-1)
  metalness?: number;

  // repeat
  repeat?: {
    x: number;
    y: number;
  };

  // Normal map scale
  normalScale?: {
    x: number;
    y: number;
  };
}

export class ModelView
  extends ThreeView<ModelViewProps>
  implements IRaycastView
{
  // "Singleton"
  public static Instance: ModelView;
  public static Product: FTProduct;

  // Public
  public get Color() {
    return this.color;
  }
  public get Raycaster() {
    return this.raycaster;
  }
  public get LastLoadedProduct() {
    return this.lastLoadedProduct;
  }
  public get Model() {
    return this.model;
  }

  // Constants
  private static readonly ResetColor = new Color(colors[0]);
  static readonly ResetPos = new Vector3(0, 0, 1);

  private readonly highlight = new HighlightModel(this);
  private readonly raycaster = new RaycastIntersection(this);

  public record: IRecordConfig = {
    isRecording: false,
    rotationCount: 1,
    duration: 1,
  };

  private lastLoadedProduct: Product | null = null;
  private lastLoadingProduct: Product | null = null;

  private color: Color | null = ModelView.ResetColor;
  private editMode: EditMode = EditMode.None;

  private materialName: string | null = null;
  private materialRepeat: Vector2 = new Vector2();
  private materialProps: MaterialProps = DefaultMaterialProps;
  private materialUse: MaterialUse = { normal: false, rough: false };

  private materialLastUpdated: MeshStandardMaterial | null = null;

  private overlayMaterial = new MeshStandardMaterial({
    transparent: true,
    color: 'rgba(255,255,255,0)',
    opacity: 0,
    map: null,
  });

  // Model
  private model!: Group;

  // Controls
  private controls!: ObjectControls;
  private mouse: Vector2 = new Vector2();

  public constructor(props: ModelViewProps) {
    super(props);

    ModelView.Instance = this;

    BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
    BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
    Mesh.prototype.raycast = acceleratedRaycast;
  }

  /**
   * Clear view
   */
  public clear() {
    for (let i = this.scene.children.length - 1; i >= 0; i--) {
      if (this.scene.children[i] instanceof Group) {
        this.scene.remove(this.scene.children[i]);
      }
    }

    if (PrintMapCanvas.Instance != null) {
      const img = document.getElementById('baseMap') as HTMLImageElement;
      if (img != null) {
        console.log('clear img src');
        img.src = '';
      }
    }

    this.camera.position.copy(ModelView.ResetPos);
  }

  public isNeedsUpdate() {
    return this.overlayMaterial.needsUpdate;
  }
  public needsUpdate() {
    if (this.isNeedsUpdate()) {
      return;
    }

    console.log('needsUpdate');

    this.overlayMaterial.needsUpdate = true;
    if (this.overlayMaterial.map != null) {
      this.overlayMaterial.map.needsUpdate = true;
    }
  }

  /**
   * Load product
   * @param product product data
   */
  public async load(product: Product) {

    if (product.modelName == this.lastLoadedProduct?.modelName) {
      return;
    }

    console.log(`load ${product?.modelName}`);

    this.clear();

    this.lastLoadingProduct = product;

    const newModel = await this.loadModelAsync(product);

    if (this.scene.children.length == 1 && newModel != null) {
      this.model = newModel;
    } else {
      return;
    }

    this.model.scale.set(
      product.modelScale,
      product.modelScale,
      product.modelScale
    );

    this.lastLoadedProduct = product;

    this.overlayMaterial.map = null;
    this.overlayMaterial.needsUpdate = true;

    this.updatePrintMapCanvas(this.renderer.domElement);

    if(!ModelView.lastState) {
      ModelView.lastState = {
        name: '',
        price: PRODUCT_PRICE,
        prints: [],
        materials: [] as MaterialInfo[],
      } as ModelStateInfo;
    }
    await this.loadState(ModelView.lastState);
  }

  public updatePrintMapCanvas(element: HTMLCanvasElement) {
    console.log(`update print canvas ${this.lastLoadingProduct != null}`);

    if (PrintMapCanvas.Instance != null && this.lastLoadingProduct != null) {
      console.log(`print canvas load ${this.lastLoadingProduct.mainTexName}`);

      const img = document.getElementById('baseMap') as HTMLImageElement;
      if (img == null) {
        return;
      }

      img.src = `/models/${this.lastLoadingProduct.mainTexName}`;

      this.overlayMaterial.map = new CanvasTexture(element);
      this.overlayMaterial.map.channel = 1;
      this.overlayMaterial.map.colorSpace = 'srgb';
      this.overlayMaterial.opacity = 1;

      ModelView.Instance.needsUpdate();

      img.onload = () => {
        console.log(`on load ${img.src}`);
        if (this.overlayMaterial?.map != null) {
          this.overlayMaterial.opacity = 1;

          ModelView.Instance.needsUpdate();
          console.log(`on load update material ${img.src}`);
        }
      };
    }
  }

  public Test() {
    const img = document.getElementById('baseMap') as HTMLImageElement;
    return !!img;
  }

  protected async createScene() {
    this.camera.position.copy(ModelView.ResetPos);
    this.camera.layers.enable(10);

    this.initEvents();
    await this.loadBackground('renderMaps/Neutral/map.hdr');
  }

  private initEvents() {
    const onPointerUp = () => {
      if (this.raycaster.HasResults) {
        if (this.editMode == EditMode.Texture) this.updateMaterialTextures();
        else this.updateColor();
      }
    };

    const onPointerDown = () => {
      if (this.raycaster.HasResults) {
        if (this.editMode == EditMode.Texture) this.updateMaterialTextures();
        else this.updateColor();
      }
    };

    const onPointerMove = (x: number, y: number) => {
      this.mouse.x = x;
      this.mouse.y = y;

      if (
        this.model != null &&
        !this.record.isRecording &&
        (this.editMode == EditMode.Color || this.editMode == EditMode.Texture)
      ) {
        this.raycaster.check(this.mouse.x, this.mouse.y);
        this.highlight.update(!this.raycaster.HasResults);
      }
    };

    eventsUtils.addEvents(
      this.renderer.domElement,
      onPointerDown,
      onPointerUp,
      onPointerMove
    );
  }

  public update(dt: number) {
    if (this.record.isRecording) {
      // todo rewire?
      // this.controls.enabled = false;

      this.skipRecordFrames -= 1;
      if (this.skipRecordFrames <= 0) {
        const path = Math.PI * 2;
        const time =
          this.record.duration /
          MathUtils.clamp(this.record.rotationCount, 1, 999);

        let speed = (path / time) * dt;
        this.path += speed;

        if (this.path >= path) {
          const overage = this.path - path;
          speed -= overage;

          this.path = 0;
          this.rotsCount++;

          console.log(`rot ${this.rotsCount} overage ${overage}`);

          if (this.rotsCount >= this.record.rotationCount) {
            console.log('stop recording');
            this.record.isRecording = false;
          }
        }
        this.model.rotateY(speed);
      }
    } else {
      // todo rewire?
      // this.controls.enabled = true;//this.controls.enabled ? !this.highlight.IsHighlighted : true;

      this.controls.update(dt);
    }

    this.renderer.render(this.scene, this.camera);
  }

  public updateWithoutControls() {
    this.model.rotateY(0);
    this.renderer.render(this.scene, this.camera);
  }


  private skipRecordFrames = 0;
  private path = 0;
  private rotsCount = 0;

  /**
   * Start video record
   */
  public startRecord() {
    this.controls.reset();
    this.model.rotation.y = 0;

    this.update(0);

    this.skipRecordFrames = 0;
    this.record.isRecording = true;
    this.path = 0;
    this.rotsCount = 0;
  }

  public setMaterialTextures(
    name: string | null,
    repeat: Vector2,
    props: MaterialUse
  ) {
    if (this.materialName === name) {
      return;
    }

    this.materialName = name;
    this.materialRepeat = repeat;
    this.materialUse = { ...props };

    this.materialLastUpdated = null;
  }

  public setMaterialProps(props: MaterialProps) {
    this.materialProps = { ...props };

    if (this.materialLastUpdated != null) {
      this.materialLastUpdated.roughness = props.roughness;
      this.materialLastUpdated.metalness = props.metalness;
      this.materialLastUpdated.normalScale.set(props.normal, props.normal);
      this.materialLastUpdated.needsUpdate = true;
    }
  }

  /**
   * Update material textures
   */
  private async updateMaterialTextures() {
    if (this.materialName == null) {
      return;
    }

    const mesh = this.raycaster.Mesh;

    const name = this.materialName;
    const repeat = this.materialRepeat;

    let albedo: Texture | null = null;
    let normal: Texture | null = null;
    let rough: Texture | null = null;

    if (name !== 'reset') {
      const loader = new TextureLoader();
      loader.setPath('textures/');

      albedo = await loader.loadAsync(`${name}/${name}_albedo.png`);
      albedo.userData.name = name;
      albedo.wrapS = albedo.wrapT = RepeatWrapping;
      albedo.repeat = repeat;

      if (this.materialUse.normal) {
        normal = await loader.loadAsync(`${name}/${name}_nor.png`);
        if (normal != null) {
          normal.userData.name = name;
          normal.wrapS = normal.wrapT = RepeatWrapping;
          normal.repeat = repeat;
        }
      }

      if (this.materialUse.rough) {
        rough = await loader.loadAsync(`${name}/${name}_rough.png`);
        if (rough != null) {
          rough.userData.name = name;
          rough.wrapS = rough.wrapT = RepeatWrapping;
          rough.repeat = repeat;
        }
      }
    }

    if (mesh.name.includes('NO_RUNTIME_TEXTURES')) {
      return;
    }

    const mats = mesh.material as MeshStandardMaterial[];

    if (mats != null) {
      for (let i = 0; i < 1; i++) {
        const mat = mats[i];

        if (name === 'reset') {
          if (mat.userData.originalMaterial) {
            if (mat.userData.material) {
              mat.userData.originalMaterial.color = mat.userData.material;
            }

            mats[i] = mat.userData.originalMaterial;
          }
        } else {
          if (!mat.userData.originalMaterial) {
            mat.userData.originalMaterial = mat.clone();
          }

          mat.roughness = this.materialProps.roughness;
          mat.metalness = this.materialProps.metalness;
          mat.normalScale.set(
            this.materialProps.normal,
            this.materialProps.normal
          );

          mat.roughnessMap = rough;
          mat.normalMap = normal;
          mat.map = albedo;

          this.materialLastUpdated = mat;
        }

        this.highlight.update(true);

        mat.needsUpdate = true;
      }
    }
  }

  private printIds = [] as any;
  public static lastState: ModelStateInfo;

  public getStateText() {
    const stateText = JSON.stringify(this.readState(), null, 4);
    return stateText;
  }

  public readState() {
    if (!this.model) return {} as ModelStateInfo;

    const materials = this.extractMaterialInfo(this.model);

    this.printIds = PrintMapCanvas.Instance
      ? [...PrintMapCanvas.Instance.printIds.entries()]
      : this.printIds;

    const prints = [] as PrintDataInfo[];

    for (const print of this.printIds) {
      const image = print[0];
      const data = print[1] as PrintMapItem;

      prints.push({
        image,
        opacity: data.opacity,
        position: new THREE.Vector2(data.position.x, data.position.y),
        rotation: new THREE.Vector2(data.rotation.z, data.rotation.z),
        scale: new THREE.Vector2(data.scale.x, data.scale.y),
        color: data.getColor(), // Сохраняем цвет SVG принта
      } as PrintDataInfo);
    }

    const state = {
      name: this.lastLoadedProduct?.title,
      price: PRODUCT_PRICE,
      materials,
      prints,
    } as ModelStateInfo;

    ModelView.lastState = state;

    return state as ModelStateInfo;
  }

  public async loadState(state: ModelStateInfo) {

    console.log('load state');
    console.log(state);

    const nodes: MeshStandardMaterial[] = [];

    this.model.traverse((node: Object3D) => {
      if (!(node instanceof Mesh)) {
        return;
      }

      const mats = Array.isArray(node.material)
        ? node.material
        : [node.material];
      mats.forEach(material => {
        if (!(material instanceof MeshStandardMaterial)) {
          return;
        }
        nodes.push(material);
      });
    });


    const loader = new TextureLoader();
    loader.setPath("textures/");

    console.log('load state materials')
    console.log(state.materials)

    for (const matInfo of state.materials) {
      const node = nodes.find(e => e.name === matInfo.name);

      if (!node) {
        continue;
      }

      node.color = new Color(matInfo.color);
      node.roughness = matInfo.roughness as number;
      node.metalness = matInfo.metalness as number;
      node.normalScale.set((matInfo.normalScale as Vector2).x, (matInfo.normalScale as Vector2).y);

      const map = matInfo.mapUrl as string;

      if(!map) continue

      const items = Object.keys(texturesSamples).flatMap(key => texturesSamples[key].items)

      const item = items.find(e=>e.image.includes(map))

      if(!item) {
        console.log('map ' + map + ' not found in textureSamples')
        continue
      }

      this.setMaterialTextures(item.slug, new Vector2(item.repeat.x, item.repeat.y), item.materialUse);

      loader.load(`${map}/${map}_albedo.png`, albedo => {
        albedo.userData.name = map;
        albedo.wrapS = albedo.wrapT = RepeatWrapping;

        if (matInfo.repeat) albedo.repeat.set(matInfo.repeat.x, matInfo.repeat.y);

        console.log('set albedo ' + albedo.id)

        node.map = albedo;
        node.needsUpdate = true;

      });

      if (this.materialUse.normal) {
        loader.load(`${map}/${map}_nor.png`, normal => {
          normal.userData.name = map;
          normal.wrapS = normal.wrapT = RepeatWrapping;

          if (matInfo.repeat) normal.repeat.set(matInfo.repeat.x, matInfo.repeat.y);

          console.log('set normal ' + normal.id)

          node.normalMap = normal;
          node.needsUpdate = true;
        });
      }

      if (this.materialUse.rough) {
        loader.load(`${map}/${map}_rough.png`, rough => {
          rough.userData.name = map;
          rough.wrapS = rough.wrapT = RepeatWrapping;

          if (matInfo.repeat) rough.repeat.set(matInfo.repeat.x, matInfo.repeat.y);

          console.log('set roughness ' + rough.id)
          node.roughnessMap = rough;
          node.needsUpdate = true;
        });
      }

    }
    
    console.log('loadedState')
    emitEvent('loadedState', 'end')
  }

  public extractMaterialInfo(model: Object3D): MaterialInfo[] {
    const materialInfo: MaterialInfo[] = [];

    // Traverse through all meshes in the model
    model.traverse((node: Object3D) => {
      if (!(node instanceof Mesh)) {
        return;
      }

      const materials = Array.isArray(node.material)
        ? node.material
        : [node.material];
      materials.forEach(material => {
        if (!(material instanceof MeshStandardMaterial)) {
          return;
        }

        const info: MaterialInfo = {
          name: material.name,
        };

        if (material.color) {
          info.color = `#${material.color.getHexString()}`;
        }
        if (material.map?.userData?.name) {
          info.mapUrl = material.map.userData.name;
        }

        // material
        info.roughness = material.roughness;
        info.metalness = material.metalness;

        if (material.map?.repeat) {
          info.repeat = material.map?.repeat;
        }

        // normal scale
        if (material.normalScale) {
          info.normalScale = {
            x: material.normalScale.x,
            y: material.normalScale.y,
          };
        }

        if (!materialInfo.find(e => e.name === info.name)) {
          materialInfo.push(info);
        }
      });
    });

    return materialInfo;
  }

  /**
   * Highlight color
   * @param color
   */
  public setColor(color: Color | null) {
    let finalColor = color;
    if (color == null) {
      finalColor = ModelView.ResetColor.clone();
    }

    this.color = finalColor;
  }

  public setEditMode(mode: EditMode) {
    this.editMode = mode;
  }

  public setZoom(value: number) {
    // TODO: implement zoom in/zoom out
    // this.controls.setZoomValue(value);
  }

  public zoomIn() {
    // TODO: implement zoom in
    this.setZoom(-1);
  }

  public zoomOut() {
    // TODO: implement zoom out
    this.setZoom(2);
  }

  private updateColor() {
    const material = (
      this.raycaster.Mesh.material as MeshStandardMaterial[]
    )[0];

    if (this.color)
        material.color?.set(this.color);
    material.userData.material = null;
    material.needsUpdate = true;
  }

  private async loadModelAsync(product: Product): Promise<Group | null> {
    const manager = new LoadingManager();

    // Initialize loading manager with URL callback.
    manager.setURLModifier(url => {
      return !url.startsWith('data:') && !url.startsWith('blob:')
        ? '/' + url
        : url;
    });

    let isSkinned = false;

    const gltfLoader = new GLTFLoader(manager);
    const gltf = await gltfLoader.loadAsync(`models/${product.modelName}`);

    const model = gltf.scene as Group;
    model.traverse(o => {
      const mesh = o as Mesh;
      if (mesh == null) {
        return;
      }
      if (mesh.type == 'SkinnedMesh') {
        isSkinned = true;
      }

      const mat = mesh.material as MeshStandardMaterial;
      const geo = mesh.geometry as BufferGeometry;

      if (mat == null || geo.index == null) {
        return;
      }

      geo.clearGroups();
      geo.addGroup(0, geo.index.count, 0);
      geo.addGroup(0, geo.index.count, 1);
      mesh.material = [mat, this.overlayMaterial];

      if (geo.hasAttribute('uv')) {
        // Add second UV layer for overlay material
        const uv1 = geo.attributes.uv.clone();

        // Flip UV
        if (product.flipBaseMapY == -1) {
          for (let i = 0; i < uv1.count; i++) {
            const u = uv1.getX(i);
            const v = uv1.getY(i);
            uv1.setXY(i, u, 1 - v);
            uv1.needsUpdate = true;
          }
        }

        // Flip UV-X - Classic Yankee hat
        if (product.flipBaseMapX == -1) {
          for (let i = 0; i < uv1.count; i++) {
            const u = uv1.getX(i);
            const v = uv1.getY(i);
            uv1.setXY(i, 1 - u, v);
            uv1.needsUpdate = true;
          }
        }

        geo.setAttribute('uv1', uv1);
      }

      if (!isSkinned) {
        mesh.position.set(product.offset.x, product.offset.y, product.offset.z);
      }
    });

    if (isSkinned) {
      model.position.sub(
        new Vector3(product.offset.x, product.offset.y, product.offset.z)
      );
    }

    //this.camera.position.copy(this.ResetPos);
    //this.camera.position.sub(new Vector3(product.offset.x, product.offset.y, product.offset.z));

    if (this.scene.children.length == 0) {
      this.scene.add(model);
    } else {
      return null;
    }

    return model;
  }

  //
  // React
  public componentDidMount(): void {
    this.controls = new ObjectControls(this);

    super.componentDidMount();

    this.createScene();

    this.controls.saveState();
  }

  public componentWillUnmount(): void {
    super.componentWillUnmount();
  }

  public render() {
    this.load(this.props.product);
    return <div className={s.main} ref={this.mount} />;
  }
}
