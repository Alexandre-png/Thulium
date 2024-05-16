import React, { useState } from 'react';
import axios from 'axios';
import styles from './AddNoteForm.module.css'
import { useUser } from '../../../Context/UserContext';

function AddNoteForm({ onAddNote }) {
    const { userId } = useUser();
    const [idLivre, setIdLivre] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('/api/Note', {
                idOwner: userId,
                idLivre: idLivre,
                content: content,
                imageUrl: imageUrl
            });

            onAddNote();

            setIdLivre('');
            setContent('');
            setImageUrl('');
        } catch (error) {
            // Gérer les erreurs
            console.error('Erreur lors de la soumission du formulaire:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.container}>
            <label> {userId}</label>
            <div className={styles.content}>
                <label>Id du Livre :</label>
                <input type="text" value={idLivre} onChange={(e) => setIdLivre(e.target.value)} />
            </div>
            <div className={styles.content}>
                <label>Contenu :</label>
                <input type="text" value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <div className={styles.content}>
                <label>URL de l'image :</label>
                <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </div>
            <button className={styles.button} type="submit">Ajouter une note</button>
        </form>
    );
}

export default AddNoteForm;