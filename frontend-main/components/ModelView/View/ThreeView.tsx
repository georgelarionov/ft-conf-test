import React from 'react';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { DebugEnvironment } from 'three/examples/jsm/environments/DebugEnvironment.js';
import {
  ACESFilmicToneMapping,
  Clock,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  WebGLRenderer
} from "three";

export interface ThreeViewProps {}

export class ThreeView<T extends ThreeViewProps> extends React.Component<T, object> {
  protected get width() { return this.mount.current?.clientWidth || 0; }
  protected get height() { return this.mount.current?.clientHeight || 0; }
  public get Rect() { return this.renderer.domElement.getBoundingClientRect(); }
  public get Camera() { return this.camera; }
  public get Renderer() { return this.renderer; }

  protected readonly clock: Clock = new Clock()
  readonly renderer: WebGLRenderer;
  readonly camera: PerspectiveCamera;
  protected readonly scene: Scene = new Scene();
  
  private frameId: number = 0;

  protected readonly mount: React.RefObject<HTMLDivElement> = React.createRef() as any;

  public constructor(props: T) {
    super(props);
    const width = Math.trunc(this.width/2)*2;
    const height = Math.trunc(this.height/2)*2;

    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.setClearColor("#F8F9FB");
    this.renderer.setClearAlpha(0);
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.camera = new PerspectiveCamera(67, width / height, 0.01, 200.0);
    
    this.onWindowResize();

    window.addEventListener('resize', () => this.onWindowResize(), false);
  }


  public setExposure(value:number) {
    this.renderer.toneMappingExposure = value;
  }
  
  public setDpi(number: number) {
    this.renderer.setPixelRatio(number);
  }
  
  public setClearColor(color:string, alpha:number){
    this.renderer.setClearColor(color);
    this.renderer.setClearAlpha(alpha);
  }
  
  public async loadBackground(name: string) {
    const background = await new RGBELoader()
      .setPath('/')
      .loadAsync(name);

    const pmremGenerator = new PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();

    const envMap = pmremGenerator.fromEquirectangular(background).texture;
    
    this.scene.environment = envMap;
    if (this.scene.background != null) {
      this.scene.background = envMap;
    }
  }

  public useBackground(use: boolean) {
    this.scene.background = use ? this.scene.environment : null;
  }

  public isBackground() {
    return this.scene.background != null
  }
  
  protected update(dt: number) {}

  private animate() {
    this.update(this.clock.getDelta());
    this.frameId = window.requestAnimationFrame(() => this.animate());
  }

  public animateUpdate() {
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


  private draw() {
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize(): void {

    const width = Math.trunc(this.width / 2) * 2;
    const height = Math.trunc(this.height / 2) * 2;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);

    this.draw();
  }

  //
  // React
  public componentDidMount() {
    this.mount.current?.appendChild(this.renderer.domElement);
    this.onWindowResize();
    this.animate();
  }

  public componentWillUnmount() {
    cancelAnimationFrame(this.frameId);
    this.mount.current?.removeChild(this.renderer.domElement);
  }
  
  public render() {
    return <div ref={this.mount} />;
  }
}
