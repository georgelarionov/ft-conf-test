import { useEffect, useState } from "react";
import { Designer, FTProduct, ICollection } from "../utils/dbModels";
import { useAuth } from "./providers/AuthProvider/AuthProvider";
import * as endpoints from "../utils/endpoints/endpoints";

export const useCollections = () => {
    // const { user, updateMenuCollections } = useAuth();
    const { user } = useAuth();
    const { loadCollections } = endpoints;
    const [collections, setCollections] = useState<ICollection[]>([]);
    const [isLoadingCollections, setIsLoadingCollections] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);

    const fetchCollections = async (params: { user_id?: string, published?: boolean, populate?: boolean, all?: boolean, offset?: number }) => {
        // console.log('UseCollections - fetch params:'+JSON.stringify(params));
        setIsLoadingCollections(true);
        try {
            const response = await loadCollections(params);
            // console.log('UseCollections - load response:'+JSON.stringify(response));
            if (!response) {
                throw new Error('Error in loadCollections Response!');
            }
            const has_more = response.data.hasMore;
            setHasMore(has_more);
            const collections = response.data.collections as ICollection[];
            // console.log('UseCollections - load response - collections:'+JSON.stringify(collections));
            setCollections(Object.values(collections));
            // if (!all) {
            //     updateMenuCollections(collections);
            // }
        } catch (error) {
            console.error("Failed to fetch collections:", error);
        }
        setIsLoadingCollections(false);
    };

    const loadMoreCollections = async (params: { user_id?: string, published?: boolean, populate?: boolean, all?: boolean, offset?: number }) => {
        setIsLoadingMore(true);
        try {
            params.all = true;
            params.offset = collections.length;

            const response = await loadCollections(params);
            if (!response) {
                throw new Error('Error in loadMoreCollections Response!');
            }
            const more_collections = response.data.collections as ICollection[];
            const has_more = response.data.hasMore;
            setHasMore(has_more);
            setCollections(collections.concat(Object.values(more_collections)));
        } catch (error) {
            console.error("Failed to load more collections:", error);
        }
        setIsLoadingMore(false);
    };

    return { collections, setCollections, isLoadingCollections, setIsLoadingCollections, fetchCollections, hasMore, loadMoreCollections, isLoadingMore };
};
