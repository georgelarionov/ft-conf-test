import { Step, STEPS, UserCheckout } from 'type';

const getProduct = (userCheckout: UserCheckout) => {
  return userCheckout.product?.title ? ` / ${userCheckout.product.title}` : '';
};

const getSample = (userCheckout: UserCheckout) => {
  return userCheckout.sample?.name ? ` / ${userCheckout.sample.name}` : '';
};

const getColor = (userCheckout: UserCheckout, currentStep: Step) => {
  return currentStep.step === STEPS.ADD_COLOR
    ? ' / Color'
    : userCheckout.color?.hex
    ? ` / ${userCheckout.color?.hex}`
    : '';
};

const getPrint = (currentStep: Step) => {
  const isPrint = currentStep.step === STEPS.CHOOSE_PRINT;
  return isPrint ? '/ Design' : '';
};

const getBackground = (currentStep: Step) => {
  const isBg = currentStep.step === STEPS.LIGHT;
  return isBg ? '/ Background settings' : '';
};

const getVideo = (currentStep: Step) => {
  return currentStep.step === STEPS.CREATE_VIDEO ? '/ Video' : '';
};

const getTexture = (userCheckout: UserCheckout, currentStep: Step) => {
  return currentStep.step === STEPS.TEXTURES ||
    currentStep.step === STEPS.TEXTURES_CATALOG
    ? ' / Texture'
    : '';
};

export const constructBreadCrumbs = (
  userCheckout: UserCheckout,
  currentStep: Step
) => {
  const catalog = userCheckout.productCatalog?.name || '';
  const product = getProduct(userCheckout);
  const sample = getSample(userCheckout);
  const color = getColor(userCheckout, currentStep);
  const print = getPrint(currentStep);
  const video = getVideo(currentStep);
  const texture = getTexture(userCheckout, currentStep);
  const light = getBackground(currentStep);

  return `${catalog}${product}${sample}${texture}${color}${print}${light}${video}`
    .split('/')
    .map((cr, i, arr) => {
      if (i === arr.length - 1) return `<strong>${cr}</strong> `;
      return `${cr} `;
    })
    .join('/ ');
};
