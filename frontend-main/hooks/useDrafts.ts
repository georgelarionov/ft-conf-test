import { useEffect, useState } from "react";
import { Designer, FTProduct, ICollection } from "../utils/dbModels";
import { useAuth } from "./providers/AuthProvider/AuthProvider";
import * as endpoints from "../utils/endpoints/endpoints";

export const useDrafts = () => {
    const { user, updateMenuDrafts } = useAuth();
    const { loadDrafts } = (user instanceof Designer)? endpoints.Designers : endpoints.Customers;
    const [drafts, setDrafts] = useState<FTProduct[]>([]);
    const [isLoadingDrafts, setIsLoadingDrafts] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);

    // useEffect(() => {
    //     const fetch = async () => {
    //         setIsLoadingDrafts(true);
    //         try {
    //             const response = await loadDrafts(true, all);
    //             const drafts = response.data.drafts as FTProduct[] // ICollection
    //             setDrafts(drafts); //.items);
    //         } catch (error) {
    //             console.error("Failed to fetch drafts:", error);
    //         }
    //         setIsLoadingDrafts(false)
    //     };

    //     fetch();
    // }, []);

    const fetchDrafts = async (all=false) => {
        setIsLoadingDrafts(true);
        try {
            const response = await loadDrafts({ populate: true, full: all });
            const drafts = response.data.drafts as FTProduct[]
            const has_more = response.data.hasMore;
            setHasMore(has_more);
            setDrafts(drafts);
            if (!all) {
                updateMenuDrafts(drafts);
            }
        } catch (error) {
            console.error("Failed to fetch drafts:", error);
        }
        setIsLoadingDrafts(false);
    };

    const loadMoreDrafts = async () => {
        setIsLoadingMore(true);
        try {
            const response = await loadDrafts({ populate: true, full: true, offset: drafts.length });
            const more_drafts = response.data.drafts as FTProduct[]
            const has_more = response.data.hasMore;
            setHasMore(has_more);
            setDrafts(drafts.concat(more_drafts));
        } catch (error) {
            console.error("Failed to load more drafts:", error);
        }
        setIsLoadingMore(false);
    };

    return { drafts, setDrafts, isLoadingDrafts, setIsLoadingDrafts, fetchDrafts, hasMore, loadMoreDrafts, isLoadingMore };
};
