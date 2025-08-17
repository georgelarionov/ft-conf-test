import s from '../UIProductCard/styles.module.css';
import { UIIconButton } from '../UIIconButton/UIIconButton';
import { UIIcon } from '../UIIcon/UIIcon';
import Loader, { LOADER_SIZE } from 'components/UI/Loader';
import { useIsMobile } from "../../../hooks/mobileResolutionDetect";
import { useAuth } from 'hooks/providers/AuthProvider/AuthProvider';
import { Designer } from 'utils/dbModels';

export const UIDraftCard = ({
  title = '',
  author = '',
  price = '',
  lastUpdate = '',
  image,
  purchased = false,
  onClick = () => {},
  canDelete = true,
  onDeleteClick = () => {},
  isDeleting = false
}) => {
  const { user } = useAuth();
  const isDesigner = (user instanceof Designer);
  const isMobileSize = useIsMobile();

  const deleteDraft = (e) =>  {
    e.stopPropagation();
    onDeleteClick();
  };

  return (
      <div role="presentation" className={s.productItem} onClick={onClick}>
        <div className={s.content}>
          {!!purchased && <p className={s.purchased}>Purchased</p>}
          {isMobileSize ? (
              <div className={s.mobileImageBorder}>
                <img src={image} alt={''} className={!image ? s.hidden : ''} />
              </div>
          ) : (
              <img src={image} alt={''} className={!image ? s.hidden : ''} />
          )}
          {canDelete && !purchased && (
              <UIIcon
                  icon={'trash'}
                  onClick={deleteDraft}
                  className={s.iconTrash}
              />
          )}
          <div className={s.textContent}>
            {!!title && <p className={s.title}>{title}</p>}
            {!!author && <p className={s.lastUpdate}>Last update {lastUpdate}</p>}
            {!!author && <p className={s.author}>{author}</p>}
            {!isDesigner && price && <p className={s.price}>{price}</p>}
          </div>
        </div>
        <div hidden={!isDeleting}>
          <Loader centered size={LOADER_SIZE.SMALL} />
        </div>
      </div>
  );
};
