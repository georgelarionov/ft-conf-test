import clsx from 'clsx';
import css from './collprow.module.scss';
import { getProductImage } from '../../../utils/productUtils';
import Loader, { LOADER_SIZE } from '../../UI/Loader';
import React, { useState } from 'react';
import { useIsMobile } from '../../../hooks/mobileResolutionDetect';
import { FTProduct, ICollection } from 'utils/dbModels';
import Button from 'components/UI/Button';
import { IconArrowCollapse, IconDropdown } from 'components/UI/UIIcon/IconData';
import classNames from 'classnames';

const MAX_VIEWED_ITEMS = 5;

interface CollectionProductsRowProps {
  canEdit?: boolean;
  collection?: ICollection;
  title?: string;
  items: Array<{_id: string}>;
  isLoading?: boolean;
  onItemClick: (item: any) => void;
  onViewAllClick?: () => void;
  onEditClick?: () => void;
  onPublishClick?: (e) => void;
}

const CollectionProductsRow: React.FC<CollectionProductsRowProps> = ({ canEdit, collection, title, items, isLoading, onItemClick, onViewAllClick, onEditClick, onPublishClick }) => {
  const isMobileSize = useIsMobile();
  const rowTitle = collection ? collection.name : title;
  const publishActionTitle = collection?.published ? 'Un-publish' : 'Publish';
  const [showTools, setShowTools] = useState(false);
  
  const remaining_items = items.length - MAX_VIEWED_ITEMS;

  return (
    <div className={css.items}>
      {isMobileSize && onViewAllClick ? (
        <div className={css.headerContainer}>
          {canEdit && 
            <div className={css.tools}>
              <button className={css.toolsbtn} onClick={() => setShowTools(!showTools)}>
                Manage&nbsp;&nbsp;
                <i className={classNames({
                  [css.arrow]: true,
                  [css.down]: !showTools,
                  [css.up]: showTools
                  })}>
                </i>
              </button>
              {showTools &&
                <div className={css.tools_content}>
                  <a href="#" onClick={onEditClick}>Edit</a>
                  <a href="#" onClick={onPublishClick}>{publishActionTitle}</a>
                </div>
              }
            </div>
          }
          <div className={css.header}>
            {rowTitle}<i className={classNames({
              [css.arrow]: true,
            })}></i>
          </div>
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
            {canEdit && 
              <div className={css.tools}>
                <button className={css.toolsbtn} onClick={() => setShowTools(!showTools)}>
                  Manage&nbsp;&nbsp;
                  <i className={classNames({
                    [css.arrow]: true,
                    [css.down]: !showTools,
                    [css.up]: showTools
                    })}>
                  </i>
                </button>
                {showTools &&
                  <div className={css.tools_content}>
                    <a href="#" onClick={onEditClick}>Edit</a>
                    <a href="#" onClick={onPublishClick}>{publishActionTitle}</a>
                  </div>
                }
              </div>
            }
            {rowTitle}
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
          ) : items.length == 0 ? (
            'No Items'
          ) : (
            <>
                {items.slice(0, MAX_VIEWED_ITEMS).map(item => {
                const image = getProductImage(item as FTProduct);

                return (
                    <div
                    key={item._id}
                    onClick={() => onItemClick(item)}
                    className={css.item}
                    >
                    <div>{image && <img src={image} alt="" />}</div>
                    </div>
                );
                })}
                {(remaining_items > 0) &&
                <div className={css.items_remaining}>
                    <div>+{remaining_items}</div>
                </div>
                }
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionProductsRow;
