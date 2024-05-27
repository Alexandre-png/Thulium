import React, { useState } from 'react';
import axios from 'axios';
import styles from './AddNoteForm.module.css'
import { useUser } from '../../../Context/UserContext';

function AddNoteForm({ onAddNote }) {
    const { userId } = useUser();
    const [idLivre, setIdLivre] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            let finalImageUrl = imageUrl;

            if (imageFile) {
                const formData = new FormData();
                formData.append('imageFile', imageFile);

                for (let pair of formData.entries()) {
                    console.log(pair[0] + ': ' + pair[1]);
                }

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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setImageUrl('');
    };
    return (
        <form onSubmit={handleSubmit} className={styles.container}>
            <label> {userId}</label>
            <div className={styles.content}>
                <label>Id du Livre :</label>
                <input type="text" value={idLivre} onChange={(e) => setIdLivre(e.target.value)} />
            </div>
            <div className={styles.content}>
                <label>Titre du livre :</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className={styles.content}>
                <label>Contenu :</label>
                <input type="text" value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <div className={styles.content}>
                <label>Image :</label>
                <input type="file" onChange={handleFileChange} />
                {imagePreview && <img src={imagePreview} alt="Preview" className={styles.imagePreview} />}
            </div>
            <button className={styles.button} type="submit">Ajouter une note</button>
        </form>
    );
}

export default AddNoteForm;