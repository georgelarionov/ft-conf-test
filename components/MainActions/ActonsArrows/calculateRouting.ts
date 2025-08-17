import * as THREE from 'three';
import { Step, STEPS, UserCheckout, UserSession } from 'type';

export const calculateRouting = (
  currentStep: Step,
  userCheckout: UserCheckout,
  updateUserCheckout: (data: Partial<UserCheckout>) => void,
  setSession: (data: Partial<UserSession>) => void,
  session: UserSession,
  goStep: (step: STEPS) => void
) => {
  switch (currentStep.step) {
    case STEPS.CHOSE_CATEGORY: {
      return {
        next: userCheckout.productCatalog?.slug
          ? STEPS.CHOOSE_PRODUCT
          : undefined,
      };
    }
    case STEPS.CHOOSE_PRODUCT: {
      return {
        next: userCheckout.product?.slug ? STEPS.SETTINGS : undefined,
        prev: STEPS.CHOSE_CATEGORY,
      };
    }
    case STEPS.SETTINGS: {
      return {
        prev: STEPS.CHOOSE_PRODUCT,
      };
    }
    case STEPS.TEXTURES_CATALOG: {
      return {
        prev: STEPS.SETTINGS,
      };
    }
    case STEPS.TEXTURES: {
      return {
        prev: STEPS.TEXTURES_CATALOG,
      };
    }
    
    case STEPS.LIGHT: {
      return {
        prev: STEPS.SETTINGS,
        onSave: () => {
          updateUserCheckout({
            light: {
              useBackground: session.light.useBackground,
              renderMap: session.light.renderMap,
              exposition: session.light.exposition,
            },
          });
          goStep(STEPS.SETTINGS);
        },
      };
    }
    case STEPS.ADD_COLOR: {
      return {
        prev: STEPS.SETTINGS,
        onSave: () => {
          updateUserCheckout({ color: session.color });
          goStep(STEPS.SETTINGS);
        },
      };
    }
    case STEPS.CHOOSE_PRINT: {
      return {
        prev: STEPS.SETTINGS,
        onSave: () => {
          // for (let i = 0; i < session.prints?.length; i++) {
          //   const item = session.prints[i];
          //
          //   session.prints[i].position = new THREE.Vector2(
          //     item.printMapItem.position.x,
          //     item.printMapItem.position.y
          //   );
          //   session.prints[i].rotation = new THREE.Vector2(
          //     item.printMapItem.rotation.z,
          //     item.printMapItem.rotation.z
          //   );
          //   session.prints[i].scale = new THREE.Vector2(
          //     item.printMapItem.scale.x,
          //     item.printMapItem.scale.y
          //   );
          // }
          updateUserCheckout({ prints: session.prints });
          goStep(STEPS.SETTINGS);
        },
      };
    }

    case STEPS.CREATE_VIDEO: {
      return {
        prev: STEPS.SETTINGS,
        onSave: () => {
          updateUserCheckout({ video: session.video });
          goStep(STEPS.SETTINGS);
        },
      };
    }

    default:
      return {};
  }
};
