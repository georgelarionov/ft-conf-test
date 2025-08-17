// utils/endpoints/endpoints-debug-customer.ts

import axios from 'axios';
import { APIEndpoints, DEBUG_SHOPIFY_ID } from 'utils/common';
import { FTProduct } from 'utils/dbModels';

const API_ENDPOINT = APIEndpoints.CustomersDebug;

const dataParams = { shopify_customer_id: DEBUG_SHOPIFY_ID }
const defaultData = {
  // ...data,
  ...dataParams
}

export async function copyDesignerProduct(ftproduct: FTProduct) {
  const product_id = ftproduct._id;
  const copyResponse = await axios.post(
    `${API_ENDPOINT}/designer/product/copy`, 
    { product_id, ...defaultData }, 
    { withCredentials: true }
  );
  return copyResponse;
}

export async function customerCheckout(ftproducts: Object[]) {
  const checkoutResponse = await axios.post(
    `${API_ENDPOINT}/checkout`, 
    { ftproducts, ...defaultData }, 
    { withCredentials: true }
  );
  return checkoutResponse;
}

export async function restorePurchases() {
  const restorePurchasesResponse = await axios.post(
    `${API_ENDPOINT}/products/purchase/restore`, 
    defaultData, 
    { withCredentials: true }
  );
  return restorePurchasesResponse;
}

export async function loadDrafts(params: { populate?: boolean, full?: boolean, offset?: number, newColl?: boolean }) {
  const loadDraftsResponse = await axios.post(
    `${API_ENDPOINT}${APIEndpoints.Drafts}/load`, 
    { ...params, ...defaultData }, 
    { withCredentials: true }
  );
  return loadDraftsResponse;
}

export async function loadLibrary() {
  const loadLibraryResponse = await axios.post(
    `${API_ENDPOINT}${APIEndpoints.Library}/load`, 
    { ...defaultData },
    { withCredentials: true }
  );
  return loadLibraryResponse;
}

export async function createDraft(json_data: any, thumbnail: any) {
  const createDraftResponse = await axios.post(
    `${API_ENDPOINT}${APIEndpoints.Drafts}/product/create`, 
    { json_data, thumbnail: thumbnail, ...defaultData }, 
    { withCredentials: true }
  );
  // console.log("createDraftResponse data:"+JSON.stringify(createDraftResponse.data));
  return createDraftResponse;
}


export async function saveDraft(product_id: string, json_data: any, thumbnail: any, price?: number) {
  const saveDraftResponse = await axios.post(
    `${API_ENDPOINT}${APIEndpoints.Drafts}/product/save`, 
    { json_data, product_id, thumbnail, price, ...defaultData }, 
    { withCredentials: true }
  );
  // console.log("saveDraftResponse data:"+JSON.stringify(saveDraftResponse.data));
  return saveDraftResponse;
}

export async function deleteDraft(product_id: string) {
  const deleteDraftResponse = await axios.post(
    `${API_ENDPOINT}${APIEndpoints.Drafts}/product/delete`, 
    { product_id, ...defaultData }, 
    { withCredentials: true }
  );
  // console.log("deleteDraftResponse data:"+JSON.stringify(deleteDraftResponse.data));
  return deleteDraftResponse;
}

export async function uploadPrint(file: File, print_name: string) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append('shopify_customer_id', DEBUG_SHOPIFY_ID || "");
  formData.append("print_name", print_name);
  const uploadResponse = await axios.post(
      `${APIEndpoints.CustomersDebug}/prints/upload`,
      formData,
      { 
          headers: { 
              'Content-Type': 'multipart/form-data' 
          }, 
          withCredentials: true 
      }
  );
  return uploadResponse;
}
