
import { ModelView } from '../components/ModelView/ModelView';
import { exportScreenshot } from '../components/ModelView/Exports/ExportScreenshot';
import * as endpoints from './endpoints/endpoints';
import { FTProduct } from './dbModels';
import { products } from '../hooks/providers/ProductsProvider/products';
import { Product, STEPS } from '../type';
import { useRouter } from 'next/router';
import { useMeta, useProducts, useSession, useUser } from '../hooks/providers';
import { eventHandler } from './WebWorker/initWebWorker';
import { worker } from '../pages/_app';
import { categories } from "../hooks/providers/CategoriesProvider/categories";
import { IUser, Designer } from './dbModels';

// const { createDraft, saveDraft } = endpoints.Customers;

export const useSaveModel = () => {
  const { setIsAutoSaveLoading, updateModelJsonText } = useMeta();
  
  const saveModel = async (user: IUser | null) => {
    setIsAutoSaveLoading(true);

    const text = await saveModelDraft(user);
    updateModelJsonText(text);

    // updateLastSaveTime();
    setIsAutoSaveLoading(false);

    return text;
  };

  return { saveModel };
};

export const saveModelDraft = async (user: IUser | null) => {
  const { saveDraft } = (user instanceof Designer)? endpoints.Designers : endpoints.Customers;
  const state = ModelView.Instance.readState();
  
  await saveDraft(
    ModelView.Product._id,
    { title: state.name, json_data: state },
    exportScreenshot(),
    state.price
  );

  const text = JSON.stringify(state, null, 4);

  return text ? text : '';
};

export const createModelDraft = async (user: IUser | null, title: string|null) => {
  const { createDraft } = (user instanceof Designer)? endpoints.Designers : endpoints.Customers;
  const response = await createDraft(
    { title, json_data: {} },
    '' // exportScreenshot()
  );

  return { newDraft: response.data.product as FTProduct };
};


export const useStateLoader = () => {
  const router = useRouter();
  const { goStep, setSession } = useSession();

  const { updateUserCheckout } = useUser();
  const { getProductList } = useProducts();

  const getProduct = (draft: FTProduct) => {
    return Object.values(products)
      .flatMap(e => e)
      .find(e => e.title === draft?.data?.title) as Product;
  }

  const getSlug = (draft: FTProduct) => {
    const slug = Object.values(categories)
        .find(e => e.title === draft?.data?.title);

    return !!slug ? slug.slug : ''
  }

  const loadState = async (draft: FTProduct) => {

    const product = getProduct(draft);
    const slug = product?.slug ?? getSlug(draft)

    ModelView.Product = draft;
    ModelView.lastState = draft.data?.json_data;

    updateUserCheckout({
      product,
      productCatalog: { slug: product?.slug ?? slug, name: product?.title ?? '' },
    });

    setSession({ product });
    getProductList(slug);
    
    if (!!product) {

      const listenState = eventHandler(
          'loadedState',
          () => {
            goStep(STEPS.CHOOSE_PRINT)
          }
      );

      worker.removeEventListener('message', listenState);
      worker.addEventListener('message', listenState);

      goStep(STEPS.SETTINGS);

    } else {

      goStep(slug && slug !== '' ? STEPS.CHOOSE_PRODUCT : STEPS.CHOSE_CATEGORY);
    }


  }

  const create = async (user: IUser | null, title: string|null = null) => {

    const { newDraft } = await createModelDraft(user, title);

    // console.log(newDraft);
    setSession({ product: null });

    await router.push({
      pathname: '/product',
      query: { id: newDraft._id },
    });

    await loadState(newDraft);
  };

  const navigateState = async (draft: FTProduct) => {

    setSession({ product: getProduct(draft) });

    await router.push({
      pathname: '/product',
      query: { id: draft._id },
    });

    await loadState(draft);
  };

  return { create, navigateState, loadState };
};
