import { useRouter } from 'next/router';
import { UIIcon } from 'components/UI/UIIcon/UIIcon';
import classnames from 'classnames';
import { useSession, useUser } from 'hooks/providers';
import { STEPS } from 'type';
import { calculateRouting } from './calculateRouting';

import s from './styles.module.css';

export const ActionsArrows = () => {
  const router = useRouter();
  const { goStep, currentStep, session, setSession } = useSession();
  const { userCheckout, updateUserCheckout } = useUser();
  const isProductStep = currentStep.step === STEPS.CHOSE_CATEGORY;

  const { next, prev, onSave } = calculateRouting(
    currentStep,
    userCheckout,
    updateUserCheckout,
    setSession,
    session,
    goStep
  );

  const goToNext = () => {
    if (!next) return;
    goStep(next);
  };

  const goToPrev = () => {
    if (isProductStep) {
      router.push('/');
      return;
    }
    if (!prev) return;
    goStep(prev);
  };

  return (
    <div className={s.actionArrows} id="actionArrows">
      <button
        className={classnames({
          [s.disabled]: !prev && !isProductStep,
        })}
        disabled={!prev && !isProductStep}
        onClick={goToPrev}
        role="presentation"
      >
        <UIIcon icon="arrowLeft" />
      </button>
      {!onSave && (
        <button
          className={classnames({
            [s.disabled]: !next,
          })}
          disabled={!next}
          onClick={goToNext}
          role="presentation"
        >
          <UIIcon icon="arrowRight" />
        </button>
      )}
      {!!onSave && <button onClick={onSave}>Save</button>}
    </div>
  );
};
