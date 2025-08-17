import { useState } from "react";
import { Designer, FTProduct, ICollection } from "../utils/dbModels";
import { useAuth } from "./providers/AuthProvider/AuthProvider";
import * as endpoints from "../utils/endpoints/endpoints";

export const useCollectionProducts = () => {
    const { user } = useAuth();
    const isDesigner = (user instanceof Designer);
    const { loadCollection, deleteCollection } = endpoints.Designers;
    const [drafts, setDrafts] = useState<FTProduct[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [title, setTitle] = useState('');

    const fetchProducts = async (collection_id: string) => {
        setIsLoadingProducts(true);
        try {
            const response = await loadCollection({ coll_id: collection_id, populate: true, full: true });
            // console.log("Collection response.data:"+JSON.stringify(response.data));
            const collection = response.data.collection as ICollection;
            const coll_products = response.data.collection_products as FTProduct [];
            const has_more = response.data.hasMore;
            setHasMore(has_more);
            setDrafts(coll_products);
            const collection_name = collection.name;
            const designer_page_title = `Collection ${collection_name}`;
            const customer_page_title = `${collection_name} Collection by ${collection.vendor}`;
            const page_title = isDesigner ? designer_page_title : customer_page_title;
            setTitle(page_title);
        }
        catch(err) {
            const e = err as Error;
            throw new Error(e.message);
        }
        setIsLoadingProducts(false);
    };

    const loadMoreProducts = async (collection_id: string) => {
        setIsLoadingMore(true);
        try {
            const response = await loadCollection({ coll_id: collection_id, populate: true, full: true, offset: drafts.length });
            const more_coll_products = response.data.collection_products as FTProduct [];
            const has_more = response.data.hasMore;
            setHasMore(has_more);
            setDrafts(drafts.concat(more_coll_products));
        } catch (err) {
            console.error("Failed to load more drafts:", err);
            const e = err as Error;
            throw new Error(e.message);
        }
        setIsLoadingMore(false);
    };

    return { title, drafts, setDrafts, isLoadingProducts, fetchProducts, hasMore, loadMoreProducts, isLoadingMore, deleteCollection };
};
