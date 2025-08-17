// utils/endpoints/endpoints-debug-designer.ts

import axios from 'axios';
import {
    APIEndpoints, DEBUG_DESIGNER_ID
} from 'utils/common';

const API_ENDPOINT = `${APIEndpoints.DesignersDebug}${APIEndpoints.DesignStudio}`;

const dataParams = { designer_id: DEBUG_DESIGNER_ID }
const defaultData = {
  ...dataParams
}


export async function loadDrafts(params: { populate?: boolean, full?: boolean, offset?: number, new_coll?: boolean }) {
    // console.log('Debug Designers load Drafts');
    const loadDraftsResponse = await axios.post(
      `${API_ENDPOINT}${APIEndpoints.Drafts}/load`, 
      { ...params, ...defaultData }, 
      { withCredentials: true }
    );
    return loadDraftsResponse;
}

export async function addCollection(params: { name: string, description?: string, productIds?: string[] }) {
    const addCollectionResponse = await axios.post(
        `${API_ENDPOINT}${APIEndpoints.Collections}/add`, 
        { ...params, ...defaultData }, 
        { withCredentials: true }
    );
    return addCollectionResponse;
}

export async function updateCollection(params: { coll_id: string, name?: string, description?: string, productIds?: string[], published?: boolean}) {
    const updateCollectionResponse = await axios.post(
        `${API_ENDPOINT}${APIEndpoints.Collections}/update`, 
        { ...params, ...defaultData }, 
        { withCredentials: true }
    );
    return updateCollectionResponse;
}

export async function loadCollection(params: { coll_id: string, populate?: boolean, full?: boolean, offset?: number, other_prods?: boolean }) {
    const loadCollectionResponse = await axios.post(
        `${API_ENDPOINT}${APIEndpoints.Collections}/load`, 
        { ...params, ...defaultData }, 
        { withCredentials: true }
    );
    return loadCollectionResponse;
}

export async function deleteCollection(coll_id: string) {
    const deleteCollectionResponse = await axios.post(
        `${API_ENDPOINT}${APIEndpoints.Collections}/delete`, 
        { coll_id, ...defaultData }, 
        { withCredentials: true }
    );
    return deleteCollectionResponse;
}

export async function createDraft(json_data: any, thumbnail: any, coll_id?: string) {
    const productCreateResponse = await axios.post(
        `${API_ENDPOINT}${APIEndpoints.Collections}/product/create`, 
        { json_data, thumbnail, coll_id, ...defaultData }, 
        { withCredentials: true }
    );
    return productCreateResponse;
}

export async function saveDraft(product_id: string, json_data: any, thumbnail: any, price?: number) {
    const saveProductResponse = await axios.post(`
        ${API_ENDPOINT}${APIEndpoints.Collections}/product/save`, 
        { json_data, product_id, thumbnail, price, ...defaultData }, 
        { withCredentials: true }
    );
    // console.log("saveProductResponse data:"+JSON.stringify(saveProductResponse.data));
    return saveProductResponse;
}
  
export async function deleteDraft(product_id: string) {
    const deleteProductResponse = await axios.post(
        `${API_ENDPOINT}${APIEndpoints.Collections}/product/delete`, 
        { product_id, ...defaultData }, 
        { withCredentials: true }
    );
    // console.log("deleteDraftResponse data:"+JSON.stringify(deleteDraftResponse.data));
    return deleteProductResponse;
}

export async function addProductToCollections(collection_ids: string[], product_id: string) {
    const productAddToCollResponse = await axios.post(
        `${API_ENDPOINT}${APIEndpoints.Collections}/product/add`, 
        { collection_ids, product_id, ...defaultData }, 
        { withCredentials: true }
    );
    return productAddToCollResponse;
}

export async function removeProductFromCollection(coll_id: string, product_id: string) {
    const productRemoveFromCollResponse = await axios.post(
        `${API_ENDPOINT}${APIEndpoints.Collections}/product/remove`, 
        { coll_id, product_id, ...defaultData }, 
        { withCredentials: true }
    );
    return productRemoveFromCollResponse;
}

export async function productSwitchCollection(coll_id_from: string, coll_id_to: string, product_id: string) {
    const productSwitchCollectionResponse = await axios.post(
        `${API_ENDPOINT}${APIEndpoints.Collections}/product/switch`, 
        { coll_id_from, coll_id_to, product_id, ...defaultData }, 
        { withCredentials: true }
    );
    return productSwitchCollectionResponse;
}

export async function uploadPrint(file: File, print_name: string) {
    const formData = new FormData();
    formData.append("image", file);
    formData.append('designer_id', DEBUG_DESIGNER_ID || "");
    formData.append("print_name", print_name);
    // console.log('Debug Designers upload Print - defaultData:'+JSON.stringify(defaultData)); // +JSON.stringify(formData));
    const uploadResponse = await axios.post(
        `${APIEndpoints.DesignersDebug}/prints/upload`,
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
