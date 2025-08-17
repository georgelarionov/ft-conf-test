import s from './styles.module.scss';
import p from '../VideoCreate/DownloadPopup/ProcessingPopup/styles.module.css';
import { UIIcon } from '../UI/UIIcon/UIIcon';
import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import Button from 'components/UI/Button';
import Loader, { LOADER_SIZE } from 'components/UI/Loader';
import { IconClose } from '../UI/UIIcon/IconData';
import { useIsMobile } from '../../hooks/mobileResolutionDetect';

const IMG_MAX_WIDTH = 1024;
const IMG_MAX_HEIGHT = 1024;

export const AddPrintDrawer = ({
    visible = false,
    setVisible = (v) => {},
    handleAddPrint = async (f, n, e) => {}
    // handleFileChange = (e: any) => {},
    // previewUrl = '',
    // handleImageLoad = (e: any) => {},
    // error = ''
}) => {
    // const [visible, setVisible] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState<string|undefined>(undefined);
    const [print_name, setPrintName] = useState('');
    const [imageDimensions, setImageDimensions] = useState({ height: 0, width: 0 });
    const [error, setError] = useState<string|undefined>(undefined);
    const isMobileSize = useIsMobile();

    const handleFileChange = (e) => {
        setError('');
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if(selectedFile) {
            if (!selectedFile.name.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
                const error = "Invalid File Type.";
                setError(error);
                return;
            }
            // Check Image Size
            if (selectedFile.size > 5242880) {
                const error = "The image file size is larger than 5MB.";
                setError(error);
                return;
            }

            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
        }
    };

    const handleImageLoad = (e) => {
        // Check Dimensions
        const { naturalWidth, naturalHeight } = e.target;
        setImageDimensions({ width: naturalWidth, height: naturalHeight });
        if (naturalWidth > IMG_MAX_WIDTH || naturalHeight > IMG_MAX_HEIGHT) {
            const error = "Image exceeds 1024 x 1024.";
            setError(error);
        }
    };

    const handlePrintNameChange = (e) => {
        setPrintName(e.target.value);
    };

    const handleSubmit = async () => {
        setUploading(true);
        await handleAddPrint(file, print_name, error);
        setUploading(false);
        setFile(null);
        setPreviewUrl(undefined);
    };
    
    return (
        <div
        className={classNames({
            [s.base]: true,
            [s.showed]: visible,
        })}
        >
        <div
            className={s.background}
            onClick={() => setVisible(false)}
        ></div>

        <div className={s.cart}>
            <div className={s.header}>
                {isMobileSize ? (
                    <button
                    className={s.closeCart}
                    onClick={() => setVisible(false)}
                    aria-label="Close sidebar"
                    >
                    <IconClose />
                    </button>
                ) : (
                    <UIIcon
                    icon="close"
                    className={p.close}
                    onClick={() => setVisible(false)}
                    />
                )}
            </div>
            <>
                <div className={s.content}>
                    <div className={s.title}>Add new print</div>
                    <div className={s.req_text}>(Maximum file size: 5MB, 1024x1024)</div>
                    <div className={s.input_file}>
                        <div className={s.print}>
                            { previewUrl &&
                                <img src={previewUrl} alt='preview' onLoad={handleImageLoad} />
                            }
                        </div>
                        <input type='file' accept='image/*' onChange={handleFileChange} />
                        <div className={s.input_file_title}>Upload File</div>
                    </div>
                    <div className={s.input_name}><input type='text' placeholder='Print name' onChange={handlePrintNameChange} /></div>
                </div>
                {error && error.length > 0 && <div className={s.error}>{error}</div>}
                {!uploading && (
                <div className={s.buttonSubmit}>
                    <Button onClick={handleSubmit} variant="function">
                    Submit for Approval
                    </Button>
                </div>
                )}
                {uploading && (
                <div className={s.checkingOut}>
                    <span>Uploading Print...</span>
                    <Loader centered size={ LOADER_SIZE.NORMAL } />
                </div>
                )}
            </>
        </div>
    </div>
  );
};
