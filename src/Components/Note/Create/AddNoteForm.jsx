import React, { useState } from 'react';
import axios from 'axios';
import styles from './AddNoteForm.module.css';
import { useUser } from '../../../Context/UserContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Dropzone from '../Component/DropZone/DropZone';
import Popup from '../Component/Popup/PopUp';


function AddNoteForm({ onAddNote }) {
    const { userId } = useUser();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const [popupMessage, setPopupMessage] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleImageDrop = (preview, file) => {
        setImagePreview(preview);
        setImageFile(file);
        setImageUrl('');
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

            await axios.post('/api/Note', {
                IdOwner: userId,
                Title: title,
                Content: content,
                ImageUrl: finalImageUrl || null
            });

            onAddNote();

            setTitle('');
            setContent('');
            setImageFile(null);
            setImagePreview('');
            setImageUrl('');

            showPopup('Note sauvegardée avec succès');
        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire:', error);
        }
    };

    const showPopup = (message) => {
        setPopupMessage(message);
        setIsPopupOpen(true);
        setTimeout(() => {
            setIsPopupOpen(false);
        }, 3000);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.container}>
            <Dropzone onImageDrop={handleImageDrop} imagePreview={imagePreview} />
            <div className={styles.infoLivre}>
                <label>Titre du livre :</label>
                <input type="text" placeholder="Titre de votre livre" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className={styles.content}>
                <label>Contenu :</label>
                <ReactQuill value={content} onChange={setContent} />
            </div>
            <button className={styles.button} type="submit">Ajouter une note</button>
        </form>
    );
}

export default AddNoteForm;
