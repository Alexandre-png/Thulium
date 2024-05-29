import React, { useCallback, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from './AddNoteForm.module.css';
import { useUser } from '../../../Context/UserContext';
import { useDropzone } from 'react-dropzone';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function AddNoteForm({ onAddNote }) {
    const { userId } = useUser();

    const [idLivre, setIdLivre] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isFullSize, setIsFullSize] = useState(false);
    const [originalDimensions, setOriginalDimensions] = useState({ width: '70vw', height: '40vh' });

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setImageUrl('');
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setImageUrl('');
    };

    const handleMouseEnter = () => {
        if (imagePreview) {
            setIsFullSize(true);
        }
    };

    const handleMouseLeave = () => {
        if (imagePreview) {
            setIsFullSize(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            let finalImageUrl = imageUrl;

            if (imageFile) {
                const formData = new FormData();
                formData.append('imageFile', imageFile);

                const uploadResponse = await axios.post(`/api/Image/${userId}/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                finalImageUrl = `http://localhost:5100/uploads/${uploadResponse.data.fileName}`;
                setImageUrl(finalImageUrl);
            }

            const response = await axios.post('/api/Note', {
                IdOwner: userId,
                IdLivre: idLivre,
                Title: title,
                Content: content,
                ImageUrl: finalImageUrl
            });

            onAddNote();

            setIdLivre('');
            setTitle('');
            setContent('');
            setImageFile(null);
            setImagePreview('');
            setImageUrl('');
        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire:', error);
        }
    };

    useEffect(() => {
        if (imagePreview) {
            const img = new Image();
            img.src = imagePreview;
            img.onload = () => {
                setOriginalDimensions({ width: img.width + 'px', height: img.height + 'px' });
            };
        }
    }, [imagePreview]);

    return (
        <form onSubmit={handleSubmit} className={styles.container}>
            <div
                {...getRootProps()}
                className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={isFullSize && imagePreview ? { 
                    backgroundImage: `url(${imagePreview})`, 
                    width: originalDimensions.width, 
                    height: originalDimensions.height 
                } : {
                    backgroundImage: `url(${imagePreview})`,
                }}
            >
                <input {...getInputProps()} onChange={handleFileChange} />
                {!imagePreview && (
                    <p>Déposer une image, ou cliquer pour en choisir une</p>
                )}
            </div>
            <section className={styles.infoLivre}>
                <div>
                    <label>Id du Livre :</label>
                    <input type="text" placeholder="Id du livre" onChange={(e) => setIdLivre(e.target.value)} />
                </div>
                <div>
                    <label>Titre du livre :</label>
                    <input type="text" placeholder="Titre de votre livre" onChange={(e) => setTitle(e.target.value)} />
                </div>
            </section>
            <div className={styles.content}>
                <label>Contenu :</label>
                <ReactQuill value={content} onChange={setContent} />
            </div>

            <button className={styles.button} type="submit">Ajouter une note</button>
        </form>
    );
}

export default AddNoteForm;
