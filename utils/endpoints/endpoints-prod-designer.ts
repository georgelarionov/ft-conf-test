// utils/endpoints/endpoints-prod-designer.ts

import { axiosInstance, axiosUploadInstance } from "../axiosInstance";
import { 
    APIEndpoints
} from 'utils/common';

const API_ENDPOINT = `${APIEndpoints.Designers}${APIEndpoints.DesignStudio}`;

export async function loadDrafts(params: { populate?: boolean, full?: boolean, offset?: number, newColl?: boolean }) {
    const loadDraftsResponse = await axiosInstance.post(
      `${API_ENDPOINT}${APIEndpoints.Drafts}/load`, 
      { ...params }
    );
    return loadDraftsResponse;
}

export async function addCollection(params: { name: string, description?: string, productIds?: string[] }) {
    const addCollectionResponse = await axiosInstance.post(
        `${API_ENDPOINT}${APIEndpoints.Collections}/add`, 
        { ...params }
    );
    return addCollectionResponse;
}

export async function updateCollection(params: { coll_id: string, name?: string, description?: string, productIds?: string[], published?: boolean }) {
    const updateCollectionResponse = await axiosInstance.post(
        `${API_ENDPOINT}${APIEndpoints.Collections}/update`, 
        { ...params }
    );
    return updateCollectionResponse;
}

export async function loadCollection(params: { coll_id: string, populate?: boolean, full?: boolean, offset?: number, other_prods?: boolean }) {
    const loadCollectionResponse = await axiosInstance.post(
        `${API_ENDPOINT}${APIEndpoints.Collections}/load`, 
        { ...params }
    );
    return loadCollectionResponse;
}

export async function deleteCollection(coll_id: string) {
    const deleteCollectionResponse = await axiosInstance.post(
        `${API_ENDPOINT}${APIEndpoints.Collections}/delete`, 
        { coll_id }
    );
    return deleteCollectionResponse;
}

export async function createDraft(json_data: any, thumbnail: any, coll_id?: string) {
    const productCreateResponse = await axiosInstance.post(
        `${API_ENDPOINT}${APIEndpoints.Collections}/product/create`, 
        { json_data, thumbnail, coll_id }
    );
    return productCreateResponse;
}

export async function saveDraft(product_id: string, json_data: any, thumbnail: any, price?: number) {
    const saveProductResponse = await axiosInstance.post(
        `${API_ENDPOINT}${APIEndpoints.Collections}/product/save`, 
        { json_data, product_id, thumbnail, price }
    );
    return saveProductResponse;
}
  
export async function deleteDraft(product_id: string) {
    const deleteProductResponse = await axiosInstance.post(
        `${API_ENDPOINT}${APIEndpoints.Collections}/product/delete`, 
        { product_id }
    );
    return deleteProductResponse;
}

export async function addProductToCollections(collection_ids: string[], product_id: string) {
    const productAddToCollResponse = await axiosInstance.post(
        `${API_ENDPOINT}${APIEndpoints.Collections}/product/add`, 
        { collection_ids, product_id }
    );
    return productAddToCollResponse;
}

export async function removeProductFromCollection(coll_id: string, product_id: string) {
    const productRemoveFromCollResponse = await axiosInstance.post(
        `${API_ENDPOINT}${APIEndpoints.Collections}/product/remove`, 
        { coll_id, product_id }
    );
    return productRemoveFromCollResponse;
}

export async function productSwitchCollection(coll_id_from: string, coll_id_to: string, product_id: string) {
    const productSwitchCollectionResponse = await axiosInstance.post(
        `${API_ENDPOINT}${APIEndpoints.Collections}/product/switch`, 
        { coll_id_from, coll_id_to, product_id }
    );
    return productSwitchCollectionResponse;
}

export async function uploadPrint(file: File, print_name: string) {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("print_name", print_name);
    // console.log('Debug Designers upload Print - defaultData:'+JSON.stringify(defaultData)); // +JSON.stringify(formData));
    const uploadResponse = await axiosUploadInstance.post(
        `${APIEndpoints.Designers}/prints/upload`, 
        formData
    );
    return uploadResponse;
}
