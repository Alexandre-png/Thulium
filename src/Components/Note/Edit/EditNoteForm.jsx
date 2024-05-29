import React, { useState } from 'react';
import axios from 'axios';
import styles from './EditNoteForm.module.css';

function EditNoteForm({ note, onEditNote }) {
    const [idLivre, setIdLivre] = useState(note.idLivre);
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(note.imageUrl);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            let imageUrl = note.imageUrl;
            if (imageFile) {
                const formData = new FormData();
                formData.append('imageFile', imageFile);
                formData.append('userId', note.idOwner);

                const uploadResponse = await axios.post(`/api/Image/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                imageUrl = `/uploads/${uploadResponse.data.fileName}`;
            }

            await axios.put(`/api/Note/${note.id}`, {
                IdOwner: note.idOwner,
                IdLivre: idLivre,
                Title: title,
                Content: content,
                ImageUrl: imageUrl
            });

            onEditNote();
        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire:', error);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    return (
        <form onSubmit={handleSubmit} className={styles.container}>
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
            <button className={styles.editButton} type="submit">Modifier la note</button>
        </form>
    );
}

export default EditNoteForm;
