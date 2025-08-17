import css from './page.module.scss';
import s from '../UI/UIProductCard/styles.module.css';
import { Layout, LayoutContent, LayoutSidebar } from '../layouts/Layout';
import MainHeader from '../MainHeader/MainHeader';
import React, { useState, useEffect } from 'react';
import { Cart } from '../Cart/Cart';
import { useAuth } from 'hooks/providers/AuthProvider/AuthProvider';
import Button from 'components/UI/Button';
import { Customer, Designer, UserPrints } from 'utils/dbModels';
import { UIButton } from 'components/UI/UIButton/UIButton';
import * as endpoints from "../../utils/endpoints/endpoints";
import SegmentedControl from 'components/UI/SegmentedControl/SegmentedControl';
import { usePrints } from 'hooks/usePrints';
import Loader, { LOADER_SIZE } from 'components/UI/Loader';
import ModalAlert from 'components/UI/ModalAlert';
import { UIIcon } from 'components/UI/UIIcon/UIIcon';
import { UICustomDesignCard } from 'components/UI/UICustomDesignCard/UICustomDesignCard';
import { AddPrintDrawer } from 'components/AddPrintDrawer/AddPrintDrawer';
import { UsersPrintsStatuses } from 'utils/common';

const SHOPIFY_ACCOUNT_URL = 'https://shop.faithtribe.io/account';

export default function ProfilePage() {
    const { user, isAuthorized } = useAuth();
    const [isCustomer, setIsCustomer] = useState(false);
    const [isDesigner, setIsDesigner] = useState(false);
    const [email, setEmail] = useState<string|undefined>('');
    const [selectedSegment, setSelectedSegment] = useState<string>(UsersPrintsStatuses.APPROVED);
    const [showAddPrintDrawer, setShowAddPrintDrawer] = useState(false);
    const [errorAlert, setErrorAlert] = useState<string|null>(null);
    const [msgAlert, setMsgAlert] = useState<string|null>(null);
    const { prints, isLoadingPrints, fetchPrints } = usePrints();

    useEffect(() => {
        setIsCustomer(user instanceof Customer);
        setIsDesigner(user instanceof Designer);
        const em = (user instanceof Designer) ? user?.login_email : user?.email;
        setEmail(em);
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [selectedSegment]);
    
    const fetchData = async () => {
        await fetchPrints({ user_id: user?._id, status: selectedSegment });
    };

    const handleOpenAccount = (event) => {
        event.preventDefault();
        window.open(SHOPIFY_ACCOUNT_URL, '_blank', 'noopener,noreferrer');
    };

    const handleShowAddPrintDrawer = () => {
        setShowAddPrintDrawer(true);
    };
    
    const handleAddPrint = async (file, print_name, error) => {
        if (!file) return setErrorAlert("Please select a file");
            
        const { uploadPrint } = isDesigner ? endpoints.Designers : endpoints.Customers;
        
        if(error) {
            setErrorAlert(error);
            return;
        }
        
        try {
            // const formData = new FormData();
            // formData.append("image", file);
            // console.log("formData:"+JSON.stringify(formData));
            const response = await uploadPrint(file, print_name);
            if (response.data.success) {
                setShowAddPrintDrawer(false);
                setMsgAlert("Upload successful");
                handleSegmentSelection(UsersPrintsStatuses.PENDING);
                // await fetchData();
            }
        }
        catch(err) {
            const e = err as Error;
            console.log(e.message);
            setErrorAlert(e.message);
        }
        // setFile(null);
        // setPreviewUrl(undefined);
    };

    const handleSegmentSelection = (selectedOption: string) => {
        if (selectedOption !== selectedSegment) {
          setSelectedSegment(selectedOption);
        }
    };

    const pageOptions = [UsersPrintsStatuses.APPROVED, UsersPrintsStatuses.PENDING, UsersPrintsStatuses.DENIED];
    
    return (
        <>
            <Layout>
                <LayoutSidebar />
                <LayoutContent>
                    <MainHeader withLogo={false} />
                    <div className={css.content}>
                        <div className={css.name_row}>
                            {user?.first_name} {user?.last_name}
                        </div>
                        <div className={css.email}>{email}</div>
                        { isDesigner &&
                            <div className={css.name_row}>
                                {(user as Designer)?.vendor}
                            </div>
                        }
                        <div className={css.account_tools}>
                            { isCustomer && 
                                <div className={css.account_button}>
                                    <Button onClick={handleOpenAccount} variant='function'>
                                        Shopify Account
                                    </Button>
                                </div>
                            }
                            <div className={css.add_print_button}>
                                <Button onClick={handleShowAddPrintDrawer} variant='function'>
                                    Add Print
                                </Button>
                            </div>
                        </div>
                        <div className={css.prints_designs}>
                            Your prints / designs
                        </div>
                        <div className={css.prints_segments}>
                            <SegmentedControl
                                initialSelection={selectedSegment}
                                options={pageOptions}
                                onSelectionChange={handleSegmentSelection}
                            />
                        </div>
                        <div className={css.my_prints}>
                        {isLoadingPrints ? 
                            (<Loader centered size={ LOADER_SIZE.NORMAL } />)
                            :
                            <div className={css.my_prints_grid}>
                                {prints?.map((print: UserPrints, index: number) => {
                                    return (
                                        <UICustomDesignCard
                                            key={print._id}
                                            print={print}
                                            // canDelete={print.owner === user?._id}
                                            // onDeleteClick={}
                                        />
                                    );
                                })}
                            </div>
                        }
                        </div>
                        {msgAlert &&
                        <ModalAlert
                            opened
                            title={''}
                            message={msgAlert}
                            onClose={() => setMsgAlert(null)}
                        />}
                        {errorAlert &&
                        <ModalAlert
                            opened
                            title={'Error'}
                            message={errorAlert}
                            onClose={() => setErrorAlert(null)}
                            isError={true}
                        />}
                    </div>
                </LayoutContent>
            </Layout>
            <AddPrintDrawer 
                visible={showAddPrintDrawer}
                setVisible={setShowAddPrintDrawer}
                handleAddPrint={handleAddPrint}
            />
            { isCustomer &&
            <Cart />
            }
        </>
    );
}
