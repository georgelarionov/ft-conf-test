import classnames from "classnames";
import React from 'react';
import {
  Clock,
  Euler,
  Material,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer
} from "three";
import { ModelView } from "../ModelView";
import { RectTransformHandle, RectTransformRotateHandle } from "./RectTransformControl";

import s from './styles.module.css';
import { IRaycastView } from '../Raycaster/Raycaster';
import { RaycastIntersection } from '../Raycaster/RaycastIntersection';
import { ControlMode } from '../View/ModelView.types';
import { PrintMapItem } from './PrintMapItem';
import scrollLock from 'scroll-lock';
import { eventsUtils } from "../../../utils/eventsUtils";
import testUtils from "../../../utils/testUtils";
import { Keys } from "./Keys";

export interface Props {
  controlMode: ControlMode;
  image: string;
  opacity: number;
}

export class PrintMapCanvas extends React.Component<Props, object> implements IRaycastView {
  // "Singleton"
  public static Instance: PrintMapCanvas;
  
  // Access
  public static get width() { return testUtils.iOSSafari ? 512 : 2048; };
  public static get height() { return testUtils.iOSSafari ? 512 : 2048; };
  
  // Public
  public get Rect() { return this.renderer.domElement.getBoundingClientRect(); }
  public get Camera() { return this.camera; }
  public get Model() { return this.scene; }
  
  // Private
  private readonly clock: Clock = new Clock();
  private readonly raycaster: RaycastIntersection = new RaycastIntersection(this);
  
  // Renderer/Camera/Scene
  public readonly renderer: WebGLRenderer;
  public camera!: PerspectiveCamera;
  public readonly scene: Scene = new Scene();

  // Setup
  private readonly mount: React.RefObject<HTMLDivElement> = React.createRef() as any;
  private clearInterval!: NodeJS.Timeout;
  private frameId: number = 0;

  // Prints & Active print item
  public printIds: Map<string, PrintMapItem> = new Map<string, PrintMapItem>();
  public activeControl: PrintMapItem | null = null;
  
  private isScrollDisabled = false;
  
  // Move state
  private move = false;
  private drag = false;
  private dragRect = false;
  private dragRot = false;
  public get AnyDrag() {return this.move || this.drag || this.dragRect || this.dragRot };
  
  // Start states
  private dragStartPoint: Vector3 = new Vector3();
  private dragObject: Object3D|null = null;
  private shift: Vector2 = new Vector2();
  
  // Start states
  private startScale: Vector3 = new Vector3();
  private startPosition: Vector3 = new Vector3();
  private startRot: Euler = new Euler();
  

  public constructor(props: Props) {
    super(props);

    PrintMapCanvas.Instance = this;
    
    
    this.renderer = new WebGLRenderer({ alpha: true });

    this.initEvents()
    
  }
  
  private initEvents() {
    const onPointerDown = (x: number, y: number) => {

      this.raycaster.check(x, y);

      if (this.raycaster.HasResults && (this.raycaster.Object.name == Keys.PrintItem ||
          this.raycaster.Object.parent?.name == Keys.PrintItem))
      {
        this.disableScroll();
        let control = this.raycaster.Object as PrintMapItem;

        if (this.raycaster.Object.parent?.name == Keys.PrintItem) {
          control = this.raycaster.Object.parent as PrintMapItem;
        }

        if (control != null && control != this.activeControl)
        {
          this.clearActive();
          this.activeControl = control;
          this.activeControl.invokeChange();
          this.activeControl.setActive(true);
        }
      }

      if (this.activeControl !== null)
      {
        if (this.raycaster.HasResults && this.raycaster.Object.name === Keys.PrintCanvasBack)
        {
          this.disableScroll();
          this.clearActive();

          return;
        }


        this.move = true;

        if (this.raycaster.HasResults && (this.raycaster.Object.name == Keys.Rect ||
            this.raycaster.Object.name == Keys.RectChild)) {

          this.disableScroll();
          this.dragRect = true;
          this.dragObject = (this.raycaster.Object.name == Keys.RectChild ? 
              this.raycaster.Object.parent : this.raycaster.Object) as RectTransformHandle;

          this.dragStartPoint = this.raycaster.First.point;
          this.shift = new Vector2(this.dragObject.userData.x, this.dragObject.userData.y);

          if (this.dragObject.parent)
          {
            this.startScale = this.dragObject.parent.parent!.scale.clone();
            this.startPosition = this.dragObject.parent.parent!.position.clone();
          }

          return;
        }
        else {
          this.drag = false;
        }

        if(this.raycaster.HasResults && (this.raycaster.Object.name == Keys.Rot ||
            this.raycaster.Object.name == Keys.RotChild)) {

          this.disableScroll();
          this.dragRot = true;
          this.dragObject = (this.raycaster.Object.name == Keys.RotChild ? 
              this.raycaster.Object.parent : this.raycaster.Object) as RectTransformHandle;
          this.dragStartPoint = this.raycaster.First.point.clone();

          this.shift = new Vector2(this.raycaster.First.point.x - this.dragObject.parent!.parent!.position.x, 
              this.raycaster.First.point.y - this.dragObject.parent!.parent!.position.y);
          this.startRot = this.dragObject.parent!.parent!.rotation.clone();

          return;
        }
        else {
          this.dragRot = false;
        }

        if(this.activeControl != null) {

          this.disableScroll();
          this.drag = true;
          this.shift = new Vector2(this.raycaster.First.point.x - this.activeControl.position.x, this.raycaster.First.point.y - this.activeControl.position.y);

          return;
        }
      }
    }
    const onPointerUp = () => {
      this.move = false;
      this.drag = false;
      this.dragRect = false;
      this.dragRot = false;
    };
    const onPointerMove = (x: number, y: number) => {

      if(this.drag) {

        this.disableScroll();
        this.raycaster.check(x, y);

        this.activeControl?.position.set(this.raycaster.First.point.x - this.shift.x, this.raycaster.First.point.y - this.shift.y, 0);
        this.activeControl?.invokeChange();

        return;
      }

      if(this.dragRect && this.dragObject) {

        this.disableScroll();
        this.raycaster.check(x, y);

        const delta = new Vector2(this.raycaster.First.point.x - this.dragStartPoint.x, this.raycaster.First.point.y - this.dragStartPoint.y);

        const obj = this.dragObject.parent?.parent as Object3D;

        const deltaRot = delta.clone().rotateAround(new Vector2(0, 0), -obj.rotation.z);

        obj.scale.set(this.startScale.x + (deltaRot.x) * Math.sign(this.shift.x), this.startScale.y + (deltaRot.y) * Math.sign(this.shift.y), 1);
        if(obj.scale.x <= 0.05) { obj.scale.x = 0.05; }
        if(obj.scale.y <= 0.05) { obj.scale.y = 0.05; }
        obj.position.copy(this.startPosition.clone().add(new Vector3((delta.x*0.5), (delta.y*0.5), 0)));

        this.activeControl?.invokeChange();
        this.activeControl?.updateScale();

        return;
      }

      if(this.dragRot && this.dragObject) {

        this.disableScroll();
        this.raycaster.check(x, y);

        const obj = this.dragObject.parent?.parent as Object3D;

        const dir = new Vector2(this.raycaster.First.point.x - obj.position.x, this.raycaster.First.point.y - obj.position.y);

        obj.rotation.z = dir.angle() - Math.PI / 2;

        this.activeControl?.invokeChange();
      }
    }

    eventsUtils.addEvents(this.renderer.domElement, onPointerDown, onPointerUp, onPointerMove);
  }
  
  public disableScroll(){
    if (this.isScrollDisabled) {
      return;
    }
   
    scrollLock.clearQueueScrollLocks();
    scrollLock.disablePageScroll();
    this.isScrollDisabled = true;
   
    clearTimeout(this.clearInterval);
   
    this.clearInterval = setTimeout(()=> {
      
      scrollLock.clearQueueScrollLocks();
      scrollLock.enablePageScroll();

      if (!ModelView.Instance.isNeedsUpdate())
      {
        PrintMapCanvas.Instance?.update(0);
        ModelView.Instance.needsUpdate()
      }

      this.isScrollDisabled = false;
    }, 500)
  }
  
  public canAddItem(img: string) {
    return !this.hasPrintItem(img) && ModelView.Instance.Test();
  }

  public async tryAddItem( item:PrintMapItem, img: string, opacity:number, position: Vector2|null, scale: Vector2|null, rotation: Vector2|null, color?: string)
  {
    if (!this.canAddItem(img)) {
      return;
    }

    this.printIds.set(img, item);

    ModelView.Instance.updatePrintMapCanvas(this.renderer.domElement);
    
    await item.load(img, color);
    
    item.wantOpacity(opacity);
    item.onChange(() => {
      // delay
      setTimeout(() => {
        console.log(`PrintItem onChange`);

        if (testUtils.iOSSafari) {
          return;
        }

        if (!ModelView.Instance.isNeedsUpdate()) {
          console.log(`call update`);
          PrintMapCanvas.Instance?.update(0);
          ModelView.Instance.needsUpdate()
        }
      }, 10)

    });
    
    this.addPrintItem(item, img);
    
    const finalPosition = position ? position : new Vector2(0, 0);
    item.position.set(finalPosition.x, finalPosition.y, 0);
    if (rotation) {
      item.rotation.set(0, 0, rotation.x);
    }
    if (scale) {
      item.scale.set(scale.x, scale.y, 1);
    }
    
    PrintMapCanvas.Instance?.update(0);
    ModelView.Instance.needsUpdate()
  }
  
  public update(dt: number) {
    this.renderer.render(this.scene, this.camera);
    this.printIds.forEach((value => value.update()));

    this.activeControl?.update();
  }

  private animate() {
    this.update(this.clock.getDelta());
    this.frameId = window.requestAnimationFrame(() => this.animate());
  }

  public onWindowResize(): void {
    const width = PrintMapCanvas.width;
    const height = PrintMapCanvas.height;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);

    this.update(0);
  }

  public setExportSize(size: number = 512){
    const width = size;
    const height = size;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);

    this.update(0);
    return width;
  }

  public hasPrintItem(id: string) {
    return this.printIds.has(id);
  }
 
  public addPrintItem(print: PrintMapItem, id: string) {
    this.scene.add(print);
    print.addControls(this);
    print.setMode(this.props.controlMode);
    print.setOpacity(1.0);
    this.printIds.set(id, print);
  }
  
  public removePrintItem(id: string) {
    
    const print = this.printIds.get(id);
    if (print) {
      this.scene.remove(print.control);
      this.scene.remove(print);
      this.printIds.delete(id);
    }
    
    PrintMapCanvas.Instance?.update(0);
    ModelView.Instance.needsUpdate()
  }

  public clearActive(): void {
    if (this.activeControl!=null)
    {
      this.activeControl.setActive(false);
      this.activeControl.invokeChange();
      this.activeControl = null;
    }
  }


  //
  // React
  public componentDidMount() {

    this.renderer.outputColorSpace = SRGBColorSpace
    this.renderer.setClearColor(0xff0000);
    this.renderer.setClearAlpha(0);
    this.renderer.setPixelRatio(1.0);
    this.renderer.setSize(PrintMapCanvas.width, PrintMapCanvas.height);

    this.mount.current?.appendChild(this.renderer.domElement);

    this.camera = new PerspectiveCamera(60, PrintMapCanvas.width / PrintMapCanvas.height, 0.01, 100.0);
    this.camera.position.set(0, 0, 0.86);
    this.camera.lookAt(0, 0, 0);

    const back = new Mesh(new PlaneGeometry(100,100), 
        new MeshBasicMaterial({ color:"#000", transparent:true, opacity:0.0 }));
    back.name = Keys.PrintCanvasBack;
    back.position.z = -0.001;
    
    this.scene.add(back);

    window.addEventListener('resize', () => this.onWindowResize(), false);

    ModelView.Instance.updatePrintMapCanvas(this.renderer.domElement);
    setTimeout(()=>{
      ModelView.Instance.updatePrintMapCanvas(this.renderer.domElement);
    }, 300)

    this.animate();

  }

  public componentWillUnmount() {

    this.clearActive();
    cancelAnimationFrame(this.frameId);

    scrollLock.clearQueueScrollLocks();
    scrollLock.enablePageScroll();

    this.renderer.dispose();

    const cleanMaterial = (material: Material) => {
      material.dispose()

      // dispose textures
      for (const key of Object.keys(material)) {
        const value = material[key]
        if (value && typeof value === 'object' && 'minFilter' in value) {
          value.dispose()
        }
      }
    }

    this.scene.traverse(object => {
      // @ts-expect-error !object.isMesh
      if (!object.isMesh) {
        return;
      }

      // @ts-expect-error object.geometry.dispose()
      object.geometry.dispose()

      // @ts-expect-error object.material.isMaterial
      if (object.material.isMaterial) {
        // @ts-expect-error cleanMaterial(object.material)
        cleanMaterial(object.material)
      } else {
        // an array of materials
        // @ts-expect-error const material of object.material
        for (const material of object.material) {
          cleanMaterial(material)
        }
      }
    })

    this.mount.current?.removeChild(this.renderer.domElement);

  }
  
  public render() {
    return (
        <div className={classnames({ [s.PrintMap]:true })} ref={this.mount}>
          <img id="baseMap" alt="" />
        </div>
    );
  }

}
