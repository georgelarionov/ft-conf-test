import { PrintMapCanvas } from '../../ModelView/PrintMap/PrintMapCanvas';
import { ControlMode } from '../../ModelView/View/ModelView.types';
import s from './styles.module.css';

type Props = {
  image: string;
  opacity: number;
};

export const PrintCanvas = ({ image, opacity }: Props) => {
  return (
    <div className={s.printCanvas}>
      <PrintMapCanvas
        image={image}
        opacity={opacity}
        controlMode={ControlMode.Translate}
      />
    </div>
  );
};
