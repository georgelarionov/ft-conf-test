import React, { useState } from 'react';
import classnames from 'classnames';
import { UIIcon } from 'components/UI/UIIcon/UIIcon';
import { UICard } from 'components/UI/UICard/UICard';
import { readFile } from 'utils/file';
import { UniversalImageLoader } from 'utils/universalImageLoader';
import { PrintFileType } from 'type/print';

import s from './styles.module.css';

export const CUSTOM_LOADED_IMAGE_ID = 'loaded';

type Props = {
  image?: string;
  children: any;
  onImageClick?: (id: string, image: string, fileType?: PrintFileType) => () => void;
};

export const PrintUpload: React.FC<Props> = ({
  children,
  image: propsImage,
  onImageClick = () => () => {},
}) => {
  const [image, setImage] = useState(propsImage);
  const [fileType, setFileType] = useState<PrintFileType>();

  const onChange = async ({ target: { files } }) => {
    if (!files[0]) {
      setImage('');
      setFileType(undefined);
      onImageClick(CUSTOM_LOADED_IMAGE_ID, '', undefined)();
      return;
    }
    
    const file = files[0];
    const image = await readFile(file);
    
    // Определяем тип файла
    const type = UniversalImageLoader.getFileType(file.name);
    
    setImage(image);
    setFileType(type);
    onImageClick(CUSTOM_LOADED_IMAGE_ID, image, type)();
  };

  const handleDeleteImage = e => {
    e.stopPropagation();
    e.preventDefault();
    onChange({ target: { files: '' } });
  };

  return (
    <UICard
      className={classnames({
        [s.printUpload]: true,
      })}
    >
      {!!image && (
        <UIIcon
          icon="trash"
          onClick={handleDeleteImage}
          className={s.deleteIcon}
        />
      )}
      {!!image && (
        <img
          src={image}
          onClick={onImageClick(CUSTOM_LOADED_IMAGE_ID, image, fileType)}
          alt={""}/>
      )}
      {!image && (
        <div
          className={classnames({
            [s.labelWrapper]: true,
          })}
        >
          <label
            className={classnames({
              [s.label]: true,
            })}
          >
            <UIIcon icon="plus" />
            <input 
              type="file" 
              onChange={onChange}
              accept=".png,.jpg,.jpeg,.svg,.webp"
            />
          </label>
        </div>
      )}
      {children}
    </UICard>
  );
};
