import { useEffect, useState } from "react";
import { UserPrints } from "../utils/dbModels";
import { useAuth } from "./providers/AuthProvider/AuthProvider";
import * as endpoints from "../utils/endpoints/endpoints";

export const usePrints = () => {
    // const { user } = useAuth();
    const { loadPrints } = endpoints;
    const [prints, setPrints] = useState<UserPrints[]>([]);
    const [isLoadingPrints, setIsLoadingPrints] = useState(false);

    const fetchPrints = async (params: { user_id?: string, status?: string }) => {
        // console.log('UsePrints - fetch params:'+JSON.stringify(params));
        setIsLoadingPrints(true);
        try {
            const response = await loadPrints(params);
            // console.log('UsePrints - load response:'+JSON.stringify(response));
            if (!response) {
                throw new Error('Error in loadPrints Response!');
            }
            const prints = response.data.prints as UserPrints[];
            // console.log('UsePrints - load response - prints:'+JSON.stringify(prints));
            setPrints(Object.values(prints));
        } catch (error) {
            console.error("Failed to fetch prints:", error);
        }
        setIsLoadingPrints(false);
    };

    return { prints, setPrints, isLoadingPrints, setIsLoadingPrints, fetchPrints };
};
