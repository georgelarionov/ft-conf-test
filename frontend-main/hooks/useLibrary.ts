
import { useEffect, useState } from "react";
import { FTProduct } from "../utils/dbModels";
import * as endpoints from "../utils/endpoints/endpoints";
const { loadLibrary } = endpoints.Customers;

export const useLibrary = () => {
    const [library, setLibrary] = useState<FTProduct[]>([]);
    const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);

    const fetchLibrary = async () => {
        setIsLoadingLibrary(true);
        try {
            const response = await loadLibrary(true);
            const lib = response.data.library as FTProduct[];
            setLibrary(lib);
        } catch (error) {
            console.error("Failed to fetch library:", error);
        }
        setIsLoadingLibrary(false);
    };

    return { library, isLoadingLibrary, setIsLoadingLibrary, fetchLibrary };
};
