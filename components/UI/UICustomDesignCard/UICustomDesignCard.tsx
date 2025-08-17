import s from './styles.module.css';
import { UIIconButton } from '../UIIconButton/UIIconButton';
import { UIIcon } from '../UIIcon/UIIcon';
import Loader, { LOADER_SIZE } from 'components/UI/Loader';
import { useIsMobile } from "../../../hooks/mobileResolutionDetect";
import { useAuth } from 'hooks/providers/AuthProvider/AuthProvider';
import { APIEndpoints } from 'utils/common';
import { UsersPrintsStatuses } from 'utils/common';
import { format } from "date-fns";

export const UICustomDesignCard = ({
    print,
    canDelete = false,
    onDeleteClick = () => {},
    isDeleting = false
    }) => {
    const { user } = useAuth();
    const isMobileSize = useIsMobile();
    
    const title = print?.name;
    const lastUpdate = format(new Date(print?.createdAt), 'MM.dd.yyyy, H:mm');
    const image = `${APIEndpoints.Images}/${print?._id}`;
    const status = print?.status;
    const denied_status = status === UsersPrintsStatuses.DENIED;
    const denied_reason = print?.denied_reason;

    const deleteDraft = (e) =>  {
        e.stopPropagation();
        onDeleteClick();
    };

    return (
        <div className={s.content}>
            <div className={s.productItem}>
                {isMobileSize ? (
                    <div className={s.mobileImageBorder}>
                    <img src={image} alt={''} className={!image ? s.hidden : ''} />
                    </div>
                ) : (
                    <img src={image} alt={''} className={!image ? s.hidden : ''} />
                )}
                {canDelete && (
                    <UIIcon
                        icon={'trash'}
                        onClick={deleteDraft}
                        className={s.iconTrash}
                    />
                )}
            </div>
            <div className={s.textContent}>
                <div className={s.lastUpdate}>
                    <span className={s.lastUpdate}>Created at</span>
                    <span className={s.lastUpdateValue}>{lastUpdate}</span>
                </div>
                {title && <p className={s.title}>{title}</p>}
                {denied_status && denied_reason && 
                <div className={s.denied}>{denied_reason}</div>
                }
                </div>
            <div hidden={!isDeleting}>
                <Loader centered size={LOADER_SIZE.SMALL} />
            </div>
        </div>
    );
};
