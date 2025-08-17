import { FTProduct } from "./dbModels";
import { format } from "date-fns";
import { products } from "../hooks/providers/ProductsProvider/products";

export const getProductImage = (draft: FTProduct) =>
{
    let image: string|undefined
    
    if(draft.thumbnail && draft.thumbnail !== '' && draft.thumbnail?.data?.length > 0) {
        image = `data:image/png;base64,${Buffer.from(draft.thumbnail).toString('base64')}`;
    }
    else {
        // image =
        const p = Object.values(products)
            .flatMap(e => e)
            //.find(e => e.title === draft.data?.title)?.image ?? undefined
            .find(e => e.slug === draft.data?.title?.toLowerCase()) ?? undefined;
        image = p ? `/images/categories/${p.slug}.png` : 'ft.png';
    }


    return image
}

export const getProductDate = (product: FTProduct)  => {
    const updatedAt = product.updatedAt ? product.updatedAt : product.createdAt;
    return updatedAt ? format(new Date(updatedAt), 'MM.dd.yyyy, H:mm') : '-';
}
