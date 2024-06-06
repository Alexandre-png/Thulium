import React, { useState } from 'react';
import axios from 'axios';
import styles from './EditNoteForm.module.css';
import { useUser } from '../../../Context/UserContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Dropzone from '../Component/DropZone/DropZone';
import Popup from '../Component/Popup/PopUp';


function EditNoteForm({ note, onEditNote }) {
    const { userId } = useUser();

    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [imageUrl, setImageUrl] = useState(note.imageUrl || '');

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(note.imageUrl || '');

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
            let finalImageUrl = imageUrl ? imageUrl : note.ImageUrl;

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

            await axios.put(`/api/Note/${note.id}`, {
                Id: note.id,
                IdOwner: userId,
                Title: title,
                Content: content,
                ImageUrl: finalImageUrl || null
            });

            showPopup('Note sauvegardée avec succès');

            onEditNote();
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
                <input type="text" placeholder="Titre de votre livre" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className={styles.content}>
                <ReactQuill value={content} onChange={setContent} />
            </div>
            {isPopupOpen && (
                <Popup
                    message={popupMessage}
                    onClose={() => setIsPopupOpen(false)}
                />
            )}
            <div className={styles.buttonContainer}>
                <button className={styles.editButton} type="submit">Modifier la note</button>
            </div>
        </form>
    );
}

export default EditNoteForm;
