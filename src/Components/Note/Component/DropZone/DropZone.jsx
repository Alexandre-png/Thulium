import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './DropZone.module.css';

const Dropzone = ({ onImageDrop, imagePreview }) => {
    const [isFullSize, setIsFullSize] = useState(false);
    const [originalDimensions, setOriginalDimensions] = useState({ width: '70vw', height: '40vh' });
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [isMouseInCenter, setIsMouseInCenter] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [currentImagePreview, setCurrentImagePreview] = useState(imagePreview);

    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    const MIN_ASPECT_RATIO = 1.5;

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file.size > MAX_FILE_SIZE) {
            setErrorMessage('Le fichier est trop volumineux. Veuillez sélectionner une image de moins de 2 Mo.');
            setCurrentImagePreview(null);
            return;
        }

        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            const aspectRatio = img.width / img.height;
            if (aspectRatio < MIN_ASPECT_RATIO) {
                setErrorMessage('Le format de l\'image n\'est pas correct. Veuillez sélectionner une image en 3/2');
                setCurrentImagePreview(null);
                return;
            }

            setImageDimensions({ width: img.width, height: img.height });
            setOriginalDimensions({ width: img.width + 'px', height: img.height + 'px' });
            setCurrentImagePreview(img.src);
            onImageDrop(img.src, file);
            setErrorMessage(''); 
        };
    }, [onImageDrop]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleMouseMove = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const distanceX = Math.abs(x - centerX);
        const distanceY = Math.abs(y - centerY);
        const thresholdX = imageDimensions.width / 4;
        const thresholdY = imageDimensions.height / 4;

        const inCenter = distanceX < thresholdX && distanceY < thresholdY;

        if (inCenter !== isMouseInCenter) {
            setIsMouseInCenter(inCenter);
            setIsFullSize(inCenter);
        }
    };

    useEffect(() => {
        if (currentImagePreview) {
            const img = new Image();
            img.src = currentImagePreview;
            img.onload = () => {
                setImageDimensions({ width: img.width, height: img.height });
                setOriginalDimensions({ width: img.width + 'px', height: img.height + 'px' });
            };
        }
    }, [currentImagePreview]);

    return (
        <div {...getRootProps()} className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`} onMouseMove={handleMouseMove}
            style={isFullSize && currentImagePreview ? {
                backgroundImage: `url(${currentImagePreview})`,
                width: originalDimensions.width,
                height: originalDimensions.height
            } : {
                backgroundImage: `url(${currentImagePreview})`,
            }}>
            <input {...getInputProps()} />
            {!currentImagePreview && <p>Déposer une image, ou cliquer pour en choisir une</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
};

export default Dropzone;
