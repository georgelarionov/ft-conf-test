import { Euler, Material, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, TextureLoader, Vector2 } from "three";
import { PrintMapCanvas } from './PrintMapCanvas';
import { RectTransformControl, RectTransformHandle, RectTransformRotateHandle } from "./RectTransformControl";
import { ControlMode } from '../View/ModelView.types';
import { Keys } from "./Keys";
import { UniversalImageLoader } from "../../../utils/universalImageLoader";
import { PrintFileType } from "../../../type/print";

export class PrintMapItem extends Object3D {

  public control!: RectTransformControl;
  public opacity: number = 1;
  
  private change!: () => void;
  private prevOpacity: number = 1;
  private isActive = true;
  
  // Добавляем информацию о типе файла и цвете
  private fileType: PrintFileType = PrintFileType.RASTER;
  private currentColor?: string;
  private imageUrl?: string;

  public constructor() {
    super();
    this.position.z = 0;
    this.name = Keys.PrintItem;
  }

  public async load(name: string, color?: string) {
    try {
      // Сохраняем URL для возможности перезагрузки с новым цветом
      this.imageUrl = name;
      
      // Загружаем изображение через универсальный загрузчик
      const loadedImage = await UniversalImageLoader.load(name, {
        color: color
      });
      
      // Сохраняем тип файла и цвет
      this.fileType = loadedImage.type;
      this.currentColor = color;
      
      const item = new Mesh(
        new PlaneGeometry(1, 1),
        new MeshBasicMaterial({ 
          map: loadedImage.texture, 
          transparent: true, 
          opacity: 1.0 
        })
      );
      
      // Устанавливаем размеры с учетом соотношения сторон
      if (this.scale.x == 1 && this.scale.y == 1) {
        const aspectRatio = loadedImage.metadata 
          ? loadedImage.metadata.height / loadedImage.metadata.width
          : 1;
        this.scale.set(0.5, 0.5 * aspectRatio, 1);
      }
      
      // Сохраняем контролы перед очисткой
      const savedControl = this.control;
      const wasControlActive = this.control?.visible;
      
      // Удаляем только mesh элементы изображения, но не контролы
      const childrenToRemove: Object3D[] = [];
      this.children.forEach(child => {
        // Проверяем, что это не RectTransformControl
        if (child instanceof Mesh && !(child instanceof RectTransformControl)) {
          childrenToRemove.push(child);
        }
      });
      
      // Удаляем старые mesh элементы
      childrenToRemove.forEach(child => {
        if (child instanceof Mesh) {
          const material = child.material as MeshBasicMaterial;
          if (material.map) {
            material.map.dispose();
          }
          material.dispose();
        }
        this.remove(child);
      });
      
      this.add(item);
      
    } catch (error) {
      console.error('Error loading print:', error);
    }
  }
  
  /**
   * Обновляет цвет SVG принта
   */
  public async updateColor(color: string) {
    if (this.fileType !== PrintFileType.VECTOR || !this.imageUrl) {
      console.warn('Cannot update color: not an SVG or no image loaded');
      return;
    }
    
    if (color === this.currentColor) {
      return; // Цвет не изменился
    }
    
    try {
      // Сохраняем текущее состояние активности перед перезагрузкой
      const wasActive = this.isActive;
      
      // Перезагружаем SVG с новым цветом
      await this.load(this.imageUrl, color);
      
      // Восстанавливаем состояние активности после загрузки
      if (wasActive && this.control) {
        this.setActive(true);
      }
    } catch (error) {
      console.error('Error updating SVG color:', error);
    }
  }
  
  /**
   * Возвращает текущий цвет (для SVG)
   */
  public getColor(): string | undefined {
    return this.currentColor;
  }
  
  /**
   * Возвращает тип файла
   */
  public getFileType(): PrintFileType {
    return this.fileType;
  }

  public setOpacity(opacity: number) {
    
    if(this.children.length === 0) {
      return;
    }
    
    if(opacity != this.prevOpacity)
    {
      const material = ((this.children[0] as Mesh).material as MeshBasicMaterial)
      material.opacity = opacity;
      material.transparent = true
      material.needsUpdate = true;

      console.log(`set opacity: ${this.prevOpacity} -> ${opacity}`);
      
      this.prevOpacity = this.opacity;
      this.change();
    }
  }
  
  public wantOpacity(opacity: number) {
    console.log(`wantOpacity: ${opacity}`);
    this.opacity = opacity;
  }
  
  public setMode(controlMode: ControlMode) {
    if(!this.isActive) {
      return;
    }
  }

  public addControls(view: PrintMapCanvas) {
    
    this.control = new RectTransformControl(this);
    this.control.setActive(false);
    
    this.add(this.control);

    this.updateScale();
  }

  private control_Change() {
    const border = 0.48;
    if (this.position.x >= border) this.position.x = border;
    if (this.position.x <= -border) this.position.x = -border;
    if (this.position.y >= border) this.position.y = border;
    if (this.position.y <= -border) this.position.y = -border;

    this.change();
  }

  public onChange(param: () => void) {
    this.change = param;
  }

  public setActive(active: boolean) {
    this.isActive = this.control.visible = active;
    this.control.setActive(active);

    this.change();
    this.updateScale();
  }

  public invokeChange() {
    this.change();
  }
  
  public update(){
    this.setOpacity(this.opacity);
  }

  public updateScale() {

    for (let i = 0; i < this.control.children.length; i++) {
      
      const child = this.control.children[i];
      if(child.name == Keys.Line) {
        
        const str = child.userData.vertType;
      
        if (str == Keys.Vert) {
          child.scale.x = (1 / this.scale.x) * 0.5;
        } 
        else {
          child.scale.y = (1 / this.scale.y) * 0.5;
        }
        
        continue;
      }
      
      child.scale.set((1 / this.scale.x) * 0.5, (1 / this.scale.y) * 0.5, 1);
      
      
      if(child.name == Keys.Rot) {
        child.position.y = 0.5 + 0.1 * (1 / this.scale.y);
      }
      
    }
  }
}
