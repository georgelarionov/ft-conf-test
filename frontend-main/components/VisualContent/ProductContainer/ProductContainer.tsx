import React, { useState } from 'react';
import { Breadcrumbs } from 'components/Breadcrumbs/Breadcrumbs';
import { useMeta, useSession } from 'hooks/providers';
import { ModelView } from '../../ModelView/ModelView';
import { VisualContentFooter } from '../VisualContentFooter/VisualContentFooter';
import { LightMaps } from '../LightMaps/LightMaps';
import s from './styles.module.css';
import { Product, STEPS } from '../../../type';
import { ProductsList } from '../../ProductsList/ProductsList';
import classNames from 'classnames';
import { UIButton } from '../../UI/UIButton/UIButton';
import p from '../../VideoCreate/DownloadPopup/ProcessingPopup/styles.module.css';
import { UIIcon } from '../../UI/UIIcon/UIIcon';
import { UIProductCard } from '../../UI/UIProductCard/UIProductCard';
import { IconUnion } from '../../UI/UIIcon/IconData';
import { useAuth } from 'hooks/providers/AuthProvider/AuthProvider';
import { useCart } from 'hooks/providers/CartProvider/CartProvider';
import { useSaveModel } from '../../../utils/draftUtils';
import Loader, { LOADER_SIZE } from 'components/UI/Loader';
import { PRODUCT_PRICE } from 'utils/common';
import { Customer, FTProduct } from 'utils/dbModels';
import { Layout, LayoutContent, LayoutSidebar } from '../../layouts/Layout';
import { useIsMobile } from '../../../hooks/mobileResolutionDetect';
import * as endpoints from '../../../utils/endpoints/endpoints';
import { DrawerAddToCollection } from 'components/Collections/DrawerAddToCollection';
import ModalAlert from 'components/UI/ModalAlert';

export const ProductContainer = ({ product }: { product: Product }) => {
    const { user, isAuthorized, setShowLoginModal } = useAuth();
    const isCustomer = (user instanceof Customer);
    const { session, currentStep } = useSession();
    const { updateCartState, setCart } = useCart();
    const isMobileSize = useIsMobile();
    const { copyDesignerProduct } = endpoints.Customers;

    const [state, setState] = useState({
        showed: false,
    });

    const { isAutoSaveLoading } = useMeta();
    const { saveModel } = useSaveModel();

    const [showAddToCollectionsDrawer, setShowAddToCollectionsDrawer] = useState(false);
    const [responseMessage, setResponseMessage] = useState<string|null>(null);
    const [errorResponse, setErrorResponse] = useState(false);

    const handleClose = () => {
        setState(prev => ({ ...prev, showed: false }));
    };

    const handleAddToCart = async () => {
        if (!isAuthorized) {
            setShowLoginModal(true);
            return;
        }

        if (!ModelView.Product || !ModelView.Instance) {
            return;
        }
        
        let cart_product: any | null = null;
        const isUserOriginalProductOwner = ModelView?.Product?.original_owner === user?._id;
        
        if (isUserOriginalProductOwner) {
            if(!isAutoSaveLoading) {
                await saveModel(user);
            }
            cart_product = ModelView.Product;
        }
        else if(isCustomer) {
            const copy_response = await copyDesignerProduct(ModelView.Product);
            if (!copy_response.data.success) {
                return;
            }
            cart_product = copy_response.data.product_copy;
        }
        else {
            return;
        }

        updateCartState(true);
        // setCart(prev => {
        //   const newCartItem = { ftProduct: ModelView.Product, product: product };
        //   return [...prev, newCartItem];
        // });

        setCart(prev => {
            // const newCartItem = { ftProduct: ModelView.Product, product: product };
            const newCartItem = { ftProduct: cart_product, product: product };

            const existingIndex = prev.findIndex(
                item => item.ftProduct._id === newCartItem.ftProduct._id
            );

            if (existingIndex !== -1) {
                return prev.map((item, index) =>
                    index === existingIndex ? newCartItem : item
                );
            }

            return [...prev, newCartItem];
        });
    };

    const purchased = ModelView?.Product?.purchased;

    return isMobileSize ? (
        <Layout>
            <LayoutSidebar />
            <LayoutContent>{renderContent()}</LayoutContent>
        </Layout>
    ) : (
        renderContent()
    );

    function renderContent() {
        return (
            <div
                className={classNames({
                [s.productContainer]: true,
                [s.scroll]:
                    currentStep.step === STEPS.CHOSE_CATEGORY ||
                    currentStep.step === STEPS.CHOOSE_PRODUCT,
                })}
            >
            <div className={s.topContent}>
            {/*<Breadcrumbs />*/}
            {/*<LightMaps />*/}
            </div>
            <div className={s.main}>
            {!!product &&
                currentStep.step !== STEPS.CHOSE_CATEGORY &&
                currentStep.step != STEPS.CHOOSE_PRODUCT && (
                <div className={s.main}>
                    {purchased && <div className={s.purchased}>Purchased</div>}
                    {session.video?.recording && (
                    <span className={s.recording}>
                        <span className={s.recordDot} />
                        <span>Recording</span>
                    </span>
                    )}
                    <img
                    className={s.logo360}
                    src={'/images/360.svg'}
                    alt={'360'}
                    />
                    <ModelView product={product} />
                    {!isCustomer &&
                    <UIButton
                        onClick={() => setShowAddToCollectionsDrawer(true)}
                        className={ s.addToCollection }
                    >
                        ADD TO COLLECTION
                    </UIButton>
                    }
                    {(isCustomer && !purchased) && (
                    <UIButton
                        disabled={isAutoSaveLoading}
                        onClick={handleAddToCart}
                        className={
                        !isAutoSaveLoading ? s.addToCart : s.addingToCart
                        }
                    >
                        {isAutoSaveLoading ? (
                        <Loader size={LOADER_SIZE.SMALL} />
                        ) : (
                        'ADD TO CART'
                        )}
                    </UIButton>
                    )}
                    {/*TODO mb fix, need tests*/}
                    {/*<UIButton*/}
                    {/*onClick={() => {*/}
                    {/*    setState({ showed: true });*/}
                    {/*}}*/}
                    {/*className={s.summaryOpen}*/}
                    {/*>*/}
                    {/*<IconUnion />*/}
                    {/*Summary*/}
                    {/*<span>OPEN</span>*/}
                    {/*</UIButton>*/}
                    {/*<div*/}
                    {/*className={classNames({*/}
                    {/*    [s.summaryOpenModal]: true,*/}
                    {/*    [s.showed]: state.showed,*/}
                    {/*})}*/}
                    {/*>*/}
                    {/*<div className={s.summaryTitle}>Summary</div>*/}
                    {/*<div className={s.summaryProduct}>*/}
                    {/*    <img src={product.image} alt={product.slug} />*/}
                    {/*    <div className={s.summaryProductData}>*/}
                    {/*    <p>{product.title}</p>*/}
                    {/*    <p>{`$${PRODUCT_PRICE}`}</p>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*{(isCustomer && !purchased) && (*/}
                    {/*    <UIButton*/}
                    {/*    onClick={handleAddToCart}*/}
                    {/*    className={s.summaryAddToCart}*/}
                    {/*    >*/}
                    {/*    ADD TO CART*/}
                    {/*    </UIButton>*/}
                    {/*)}*/}
                    {/*</div>*/}
                </div>
                )}
                {currentStep.step == STEPS.CHOSE_CATEGORY && (
                    <div className={s.firstPage}>
                    <div className={s.line1}>START FROM SCRATCH</div>
                    <div className={s.line2}>Welcome to configurator</div>
                    <div className={s.line3}>ONBOARDING ZONE</div>
                    </div>
                )}
                {currentStep.step == STEPS.CHOOSE_PRODUCT && <ProductsList />}
            </div>

            <VisualContentFooter />
        
            <DrawerAddToCollection 
                product_id={ModelView?.Product?._id}
                visible={showAddToCollectionsDrawer}
                setVisible={setShowAddToCollectionsDrawer}
                setResponseMessage={setResponseMessage}
                setErrorResponse={setErrorResponse}
            />
            {responseMessage &&
            <ModalAlert 
                opened
                title='Adding Product to Colletions'
                message={responseMessage}
                onClose={() => setResponseMessage(null)}
                isError={errorResponse}
            />
            }
            </div>
        );
    }
};
