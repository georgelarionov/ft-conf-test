// utils/endpoints/endpoints-prod-customer.ts

import { axiosInstance, axiosUploadInstance } from "../axiosInstance";
import { APIEndpoints } from "utils/common";
import { FTProduct } from "utils/dbModels";

const API_ENDPOINT = APIEndpoints.Customers;

export async function copyDesignerProduct(ftproduct: FTProduct) {
  const product_id = ftproduct._id;
  const copyResponse = await axiosInstance.post(
    `${API_ENDPOINT}/designer/product/copy`, 
    { product_id }
  );
  return copyResponse;
}

export async function customerCheckout(ftproducts: Object[]) {
  const checkoutResponse = await axiosInstance.post(
    `${API_ENDPOINT}/checkout`, 
    { ftproducts }
  );
  return checkoutResponse;
}

export async function restorePurchases() {
  const restorePurchasesResponse = await axiosInstance.post(
    `${API_ENDPOINT}/products/purchase/restore`
  );
  return restorePurchasesResponse;
}

export async function loadDrafts(params: { populate?: boolean, full?: boolean, offset?: number, newColl?: boolean }) {
  const loadDraftsResponse = await axiosInstance.post(
    `${API_ENDPOINT}${APIEndpoints.Drafts}/load`, 
    { ...params }
  );
  return loadDraftsResponse;
}

export async function loadLibrary(populate_library = false) {
  const loadLibraryResponse = await axiosInstance.post(
    `${API_ENDPOINT}${APIEndpoints.Library}/load`, 
    { populate_library }
  );
  return loadLibraryResponse;
}

export async function createDraft(json_data: any, thumbnail: any) {
  const createDraftResponse = await axiosInstance.post(
    `${API_ENDPOINT}${APIEndpoints.Drafts}/product/create`, 
    { json_data, thumbnail: thumbnail }
  );
  return createDraftResponse;
}

export async function saveDraft(product_id: string, json_data: any, thumbnail: any, price?: number) {
  const saveDraftResponse = await axiosInstance.post(
    `${API_ENDPOINT}${APIEndpoints.Drafts}/product/save`, 
    { json_data, product_id, thumbnail, price }
  );
  return saveDraftResponse;
}

export async function deleteDraft(product_id: string) {
  const deleteDraftResponse = await axiosInstance.post(
    `${API_ENDPOINT}${APIEndpoints.Drafts}/product/delete`, 
    { product_id }
  );
  return deleteDraftResponse;
}

export async function uploadPrint(file: File, print_name: string) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("print_name", print_name);
  const uploadResponse = await axiosUploadInstance.post(
      `${APIEndpoints.Customers}/prints/upload`, 
      formData
  );
  return uploadResponse;
}
