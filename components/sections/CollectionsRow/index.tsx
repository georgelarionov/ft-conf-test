import clsx from 'clsx';
import css from './collrow.module.scss';
import { getProductImage } from '../../../utils/productUtils';
import Loader, { LOADER_SIZE } from '../../UI/Loader';
import React from 'react';
import { useIsMobile } from '../../../hooks/mobileResolutionDetect';
import { FTProduct, ICollection, IUser, Customer } from 'utils/dbModels';

const SHOWN_PRODUCTS_PER_COLL = 3;

interface CollectionsRowProps {
  viewingAs?: IUser;
  title: string;
  collections: Array<ICollection>;
  isLoading?: boolean;
  onCollectionClick: (collection: ICollection) => void;
  onViewAllClick: () => void;
}

const CollectionsRow: React.FC<CollectionsRowProps> = ({ viewingAs, title, collections, isLoading, onCollectionClick, onViewAllClick }) => {
  const isMobileSize = useIsMobile();

  return (
    <div className={css.collections}>
      {isMobileSize ? (
        <div className={css.headerContainer}>
          <div className={css.header}>{title}</div>
          <div
            className={clsx(css.viewAll)}
            onClick={onViewAllClick}
          >
            <div>+ &nbsp;View all</div>
          </div>
        </div>
      ) : (
        <>
            <div className={css.header}>
                {title}
                {!isMobileSize && (
                <div
                    className={clsx(css.viewAll)}
                    onClick={onViewAllClick}
                >
                    <div>+ View All</div>
                </div>
                )}
            </div>
        </>
      )}
      <div className={css.list}>
        <div className={css.inner}>
          {isLoading ? (
            <Loader centered size={LOADER_SIZE.NORMAL} />
          ) : collections.length == 0 ? (
            'No Items'
          ) : (
            collections.map(coll => {
              let productsThumbnails: Array<string> = [];
              if(coll.products.length > 0) {
                // console.log("Collection Products:"+JSON.stringify(products));
                productsThumbnails = coll.products.slice(0, SHOWN_PRODUCTS_PER_COLL).map(product => {
                  return getProductImage(product);
                });
              }

              const collection_name = coll.name;
              const collection_vendor = (viewingAs instanceof Customer) ? coll.vendor : '';
              const remaining_products = coll.products.length - SHOWN_PRODUCTS_PER_COLL;
              
              return (
                <div 
                  key={coll._id} className={css.collection_container}>
                  <div className={css.collection_vendor}>{collection_vendor}</div>
                  <div
                    onClick={() => onCollectionClick(coll)}
                    className={css.collection}
                  >
                    {productsThumbnails.map((thumbnail, index) => {
                      return (
                        <div key={index} className={css.collection_product_thumb}>{thumbnail && <img src={thumbnail} alt="" />}</div>
                      )
                    })}
                    {remaining_products > 0 &&
                        <div>+{remaining_products}</div>
                    }
                  </div>
                  <div className={css.collection_name}>{collection_name}</div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionsRow;
