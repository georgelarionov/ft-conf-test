import { Product } from "../../../type";
import { ThreeViewProps } from './ThreeView';

export interface ModelViewProps extends ThreeViewProps {
  product: Product
}

export enum EditMode {
  None = "none",
  Color = "color",
  Print = "print",
  Texture = "texture"
}
export enum ControlMode {
  None = "none",
  Scale = "scale",
  Rotate = "rotate",
  Translate = "translate"
}
