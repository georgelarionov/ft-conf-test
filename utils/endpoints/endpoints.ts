
// utils/endpoints/endpoints.ts

import { axiosInstance } from 'utils/axiosInstance';
import * as debugCustomerEndpoints from './endpoints-debug-customer';
import * as prodCustomerEndpoints from './endpoints-prod-customer';
import * as debugDesignerEndpoints from './endpoints-debug-designer';
import * as prodDesignerEndpoints from './endpoints-prod-designer';
import { IUser, Designer } from 'utils/dbModels';
import { 
    LOCAL_DEBUG, DEBUG_SHOPIFY_ID, DEBUG_DESIGNER_ID, APIEndpoints, getStoredUser,
} from '../common';

export const Customers = LOCAL_DEBUG ? debugCustomerEndpoints : prodCustomerEndpoints;
export const Designers = LOCAL_DEBUG ? debugDesignerEndpoints : prodDesignerEndpoints;

function getBaseAPIEndpoint(user: IUser | null | undefined) {
    const isDesigner = user instanceof Designer;
    if (LOCAL_DEBUG) {
        return isDesigner ? APIEndpoints.DesignersDebug : APIEndpoints.CustomersDebug;
    }
    return isDesigner ? APIEndpoints.Designers : APIEndpoints.Customers;
}

function getDebugParams(isDesigner: boolean) {
    let params = {};
    if(LOCAL_DEBUG) {
        params = isDesigner ? { designer_id: DEBUG_DESIGNER_ID } : { shopify_customer_id: DEBUG_SHOPIFY_ID }
    }
    return params;
}

// export const getEndpoints = () => {

// };

export const getCurrentUser = async (user: IUser | null) => {
    const api_endpoint = getBaseAPIEndpoint(user); 
    const currentUserResponse = await axiosInstance.get(`${api_endpoint}/current-user`);
    return currentUserResponse;
};

export const DesignerLogin = async (login_email: string, password: string) => {
    const loginResponse = await axiosInstance.post(
        `${APIEndpoints.Designers}/login`, 
        { login_email, password },
    );
    return loginResponse;
};

export const getProfile = async (populate_lib = false, populate_drafts = false, full_wardrobe = false) => {
    const user = getStoredUser();
    if (!user) {
        return;
    }
    const api_endpoint = getBaseAPIEndpoint(user);
    const isDesigner = user instanceof Designer;
    const debugParams = getDebugParams(isDesigner);
    // When requesting Designer Profile add Design Studio endpoint /ds
    const dsEndpoint = isDesigner ? APIEndpoints.DesignStudio : '';
    // console.log('getProfile Route:'+`${api_endpoint}${dsEndpoint}/profile`+'     -     debugParams:'+JSON.stringify(debugParams));
    const profileResponse = await axiosInstance.post(
        `${api_endpoint}${dsEndpoint}/profile`, 
        { populate_lib, populate_drafts, full_wardrobe, ...debugParams }
    );
    return profileResponse;
};

export const loadCollections = async (params: { user_id?: string, published?: boolean, populate?: boolean, full?: boolean, offset?: number }) => {
    const user = getStoredUser();
    if (!user) {
        return;
    }
    const api_endpoint = getBaseAPIEndpoint(user);
    const isDesigner = user instanceof Designer;
    const debugParams = getDebugParams(isDesigner);
    const loadCollectionsResponse = await axiosInstance.post(
        `${api_endpoint}${APIEndpoints.DesignStudio}${APIEndpoints.Collections}/load-all`, 
        { ...params, ...debugParams }
    );
    return loadCollectionsResponse;
};

export async function loadProduct(product_id) {
    const user = getStoredUser();
    if (!user) {
        return;
    }
    const api_endpoint = getBaseAPIEndpoint(user);
    const isDesigner = user instanceof Designer;
    const debugParams = getDebugParams(isDesigner);
    const loadProductResponse = await axiosInstance.post(
      `${api_endpoint}${APIEndpoints.Product}`, 
      { product_id, ...debugParams }
    );
    return loadProductResponse;
}

export const loadPrints = async (params: { user_id?: string, status?: string }) => {
    const user = getStoredUser();
    if (!user) {
        return;
    }
    const api_endpoint = getBaseAPIEndpoint(user);
    const isDesigner = user instanceof Designer;
    const debugParams = getDebugParams(isDesigner);
    const loadPrintsResponse = await axiosInstance.post(
        `${api_endpoint}/prints`, 
        { ...params, ...debugParams }
    );
    return loadPrintsResponse;
};

export const userLogout = async(auth_user: IUser | null) => {
    const user = auth_user; // || getStoredUser();
    const api_endpoint = getBaseAPIEndpoint(user);
    localStorage.removeItem('ftut');
    return axiosInstance.post(`${api_endpoint}/logout`);
};
