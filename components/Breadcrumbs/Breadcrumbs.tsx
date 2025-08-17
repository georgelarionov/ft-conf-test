import { useUser, useSession } from 'hooks/providers';
import { constructBreadCrumbs } from './helpers';

import s from './styles.module.css';

export const Breadcrumbs = () => {
  const { userCheckout } = useUser();
  const { currentStep } = useSession();

  const breadcrumbs = constructBreadCrumbs(userCheckout, currentStep);
  return (
    <div
      className={s.breadcrumbs}
      dangerouslySetInnerHTML={{ __html: breadcrumbs }}
    />
  );
};
