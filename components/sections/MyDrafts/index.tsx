import clsx from 'clsx';
import css from './mydrafts.module.scss';
import { useRouter } from 'next/router';
import { getProductImage } from '../../../utils/productUtils';
import { useDrafts } from '../../../hooks/useDrafts';
import Loader, { LOADER_SIZE } from '../../UI/Loader';
import React, { useEffect } from 'react';
import { useStateLoader } from '../../../utils/draftUtils';
import { useIsMobile } from '../../../hooks/mobileResolutionDetect';
import { useAuth } from 'hooks/providers/AuthProvider/AuthProvider';

const MyDrafts = () => {
  const router = useRouter();
  const { navigateState } = useStateLoader();
  const { drafts, isLoadingDrafts, fetchDrafts } = useDrafts()
  const isMobileSize = useIsMobile();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      await fetchDrafts();
    }
    fetchData();
  }, [user]);

  return (
    <div className={css.drafts}>
      {isMobileSize ? (
        <div className={css.headerContainer}>
          <div className={css.header}>My drafts</div>
          <div
            className={clsx(css.viewAll)}
            onClick={() => router.push('/myitems')}
          >
            <div>+ &nbsp;View all</div>
          </div>
        </div>
      ) : (
        <>
          <div className={css.header}>Recently updated</div>
        </>
      )}
      <div className={css.list}>
        <div className={css.inner}>
          {isLoadingDrafts ? (
            <Loader centered size={LOADER_SIZE.NORMAL} />
          ) : drafts.length == 0 ? (
            'No drafts'
          ) : (
            drafts.map(draft => {
              const image = getProductImage(draft);

              return (
                <div
                  key={draft._id}
                  onClick={() => navigateState(draft)}
                  className={css.item}
                >
                  <div>{!!image && <img src={image} alt="" />}</div>
                </div>
              );
            })
          )}
        </div>
        {!isMobileSize && (
          <div
            className={clsx(css.item, css.viewAll)}
            onClick={() => router.push('/myitems')}
          >
            <div>+</div>
            <div>View all</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDrafts;
