import s from './styles.module.css';
import { useIsMobile } from '../../../hooks/mobileResolutionDetect';
import { useState } from 'react';

export const UIProductCard = ({
                                title = '',
                                author = '',
                                price = '',
                                image,
                                onClick = () => {},
                              }) => {
  const isMobileSize = useIsMobile();
  const [isHovered, setIsHovered] = useState(false);
  const [hoverImageLoaded, setHoverImageLoaded] = useState(false);

  // Генерируем путь к hover изображению
  const getHoverImagePath = (imagePath: string) => {
    if (!imagePath) return '';
    
    // Разбиваем путь на части
    const lastDotIndex = imagePath.lastIndexOf('.');
    if (lastDotIndex === -1) return imagePath + '-hover';
    
    const pathWithoutExt = imagePath.substring(0, lastDotIndex);
    const extension = imagePath.substring(lastDotIndex);
    
    return `${pathWithoutExt}-hover${extension}`;
  };

  const hoverImage = getHoverImagePath(image);

  return (
      <div 
        role="presentation" 
        className={s.productItem} 
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={s.content}>
          {isMobileSize ? (
              <div className={s.mobileImageBorder}>
                <img src={image} alt={title} className={s.mainImage} />
              </div>
          ) : (
              <div className={s.imageContainer}>
                <img src={image} alt={title} className={s.mainImage} />
                {/* Показываем hover изображение только если оно загрузилось */}
                <img 
                  src={hoverImage} 
                  alt=""
                  className={`${s.hoverImage} ${isHovered && hoverImageLoaded ? s.visible : ''}`}
                  onLoad={() => setHoverImageLoaded(true)}
                  onError={() => setHoverImageLoaded(false)}
                />
              </div>
          )}
          <div className={s.textContent}>
            {!!title && <p className={s.title}>{title}</p>}
            {!!author && <p className={s.author}>{author}</p>}
            {!!price && <p className={s.price}>{price}</p>}
          </div>
        </div>
      </div>
  );
};
