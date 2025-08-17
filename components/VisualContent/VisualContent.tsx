import { ProductContainer } from './ProductContainer/ProductContainer';

import s from './styles.module.css';
import classnames from 'classnames';
import { useSession } from '../../hooks/providers';
import classNames from "classnames";
import { STEPS } from "../../type";

type Props = {
  className?: string;
};

export const VisualContent = ({ className }: Props) => {
  const { session, currentStep } = useSession();

  const product = session.product;

  return (
    <div className={classNames({
      [s.visualContent]: true,
      [className as string]: true,
      [s.paddings]: (currentStep.step === STEPS.CHOOSE_PRODUCT || currentStep.step == STEPS.CHOSE_CATEGORY),
    })} id="visualContent">
      <ProductContainer product={product} />
    </div>
  );
};
