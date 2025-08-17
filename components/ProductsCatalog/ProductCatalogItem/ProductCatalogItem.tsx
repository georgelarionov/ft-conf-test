import { UICard } from 'components/UI/UICard/UICard';
import { useSession, useUser } from 'hooks/providers';
import s from './styles.module.scss';
import React, { useState } from 'react';
import { STEPS } from '../../../type';
import { IconClose } from '../../UI/UIIcon/IconData';

const PreviewIcon = (props: { opacity: number }) => {
    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                opacity={props.opacity}
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.67524 0.203041C10.5495 -2.3793e-05 12.9119 -1.31342e-05 15.9257 2.15958e-07H16.0743C19.0881 -1.31342e-05 21.4505 -2.3793e-05 23.3248 0.203041C25.2374 0.410267 26.7872 0.840737 28.1104 1.8021C28.9114 2.3841 29.6159 3.08856 30.1979 3.88962C31.1593 5.21282 31.5897 6.76257 31.797 8.67524C32 10.5495 32 12.912 32 15.9257V16.0098C32 17.543 32 18.9017 31.9751 20.1034C31.902 23.6383 31.6254 26.1456 30.1979 28.1104C29.6159 28.9114 28.9114 29.6159 28.1104 30.1979C26.7872 31.1593 25.2374 31.5897 23.3248 31.797C21.4505 32 19.0881 32 16.0744 32H15.9257C12.912 32 10.5495 32 8.67524 31.797C6.76257 31.5897 5.21281 31.1593 3.88962 30.1979C3.11763 29.637 2.43536 28.9624 1.86594 28.1972C1.8445 28.1684 1.82321 28.1394 1.8021 28.1104C0.840737 26.7872 0.410267 25.2374 0.203041 23.3248C-2.38174e-05 21.4505 -1.31599e-05 19.0881 2.16593e-07 16.0743V15.9257C-1.27424e-05 12.912 -2.28882e-05 10.5495 0.203042 8.67524C0.410267 6.76257 0.840737 5.21282 1.8021 3.88962C2.3841 3.08856 3.08856 2.3841 3.88962 1.8021C5.21282 0.840737 6.76257 0.410267 8.67524 0.203041ZM29.5308 18.8745L29.4273 18.7747C28.9745 18.3396 28.6399 18.0453 28.3251 17.8218C24.7989 15.3181 19.9349 15.9811 17.2074 19.3372C16.878 19.7425 16.5483 20.2826 16.0299 21.1892L15.1795 20.9231C13.2176 20.5307 12.2367 20.3345 11.3363 20.3536C8.92693 20.4048 6.66184 21.5126 5.14221 23.3831C4.63563 24.0066 4.22492 24.786 3.5069 26.2175C3.59545 26.3742 3.69086 26.5222 3.79352 26.6635L3.84071 26.7277C4.26159 27.2933 4.76588 27.7919 5.33647 28.2065C6.17012 28.8122 7.23714 29.1652 8.94038 29.3497C10.6667 29.5368 12.8959 29.5385 16 29.5385C19.1041 29.5385 21.3333 29.5368 23.0596 29.3497C24.7629 29.1652 25.8299 28.8122 26.6635 28.2065C27.2556 27.7763 27.7763 27.2556 28.2065 26.6635C29.1282 25.3949 29.44 23.6351 29.5141 20.0525C29.5219 19.6768 29.5272 19.2847 29.5308 18.8745ZM14.359 14.359C12.5463 14.359 11.0769 12.8896 11.0769 11.0769C11.0769 9.2643 12.5463 7.79487 14.359 7.79487C16.1716 7.79487 17.641 9.2643 17.641 11.0769C17.641 12.8896 16.1716 14.359 14.359 14.359Z"
                fill="#DADADD"
            />
        </svg>
    );
};

export const ProductCatalogItem = ({ selected, title, slug, onReset }) => {
    const { goStep } = useSession();
    const { updateUserCheckout } = useUser();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [hoverImageLoaded, setHoverImageLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    
    const onClick = () => {
        updateUserCheckout({ productCatalog: { name: title, slug } });
        goStep(STEPS.CHOOSE_PRODUCT);
    };
    const handleButtonClick = (e) => {
        e.stopPropagation(); // Предотвращает клик по .item
        onReset(); // Вызываем сброс
    };

    // Пути к изображениям
    const mainImage = `/images/categories/${slug}.png`;
    const hoverImage = `/images/categories/${slug}-hover.png`;

    return (
        <div  
            className={`${s.item} ${selected ? s.selected : ''}`}  
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={s.inner}>
                <div className={s.image}>
                    <img 
                        src={mainImage} 
                        alt="" 
                        className={s.mainImage}
                        onLoad={() => setImageLoaded(true)}
                    />
                    {/* Показываем hover изображение только если оно загрузилось */}
                    <img 
                        src={hoverImage} 
                        alt=""
                        className={`${s.hoverImage} ${isHovered && hoverImageLoaded ? s.visible : ''}`}
                        onLoad={() => setHoverImageLoaded(true)}
                        onError={() => setHoverImageLoaded(false)}
                    />
                </div>
            </div>
            <div className={s.title}>{title}</div>

            {(
                <button
                    className={`${s.roundButton} ${selected ? s.selected : ''}`}
                    aria-label="Action Button"
                    onClick={handleButtonClick} // Вызываем функцию с `stopPropagation()`
                >
                    <IconClose />
                </button>
            )}
        </div>
    );
};

