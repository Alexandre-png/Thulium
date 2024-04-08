import React, { useState } from 'react';
import axios from 'axios';
import styles from './AddNoteForm.module.css'

function AddNoteForm({ onAddNote }) {
    const [id, setId] = useState('');
    const [idOwner, setIdOwner] = useState('');
    const [idLivre, setIdLivre] = useState('');
    const [idTag, setIdTag] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:5100/api/Note', {
                id: id,
                idOwner: idOwner,
                idLivre: idLivre,
                idTag: idTag,
                content: content,
                imageUrl: imageUrl
            });

            // Appeler la fonction de rappel pour mettre à jour la liste des notes
            onAddNote();

            // Réinitialiser les champs après la soumission réussie
            setId('');
            setIdOwner('');
            setIdLivre('');
            setIdTag('');
            setContent('');
            setImageUrl('');
        } catch (error) {
            // Gérer les erreurs
            console.error('Erreur lors de la soumission du formulaire:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.container}>
            <div className={styles.content}>
                <label>Id :</label>
                <input  type="text" value={id} onChange={(e) => setId(e.target.value)} />
            </div>
            <div className={styles.content}>
                <label>Id du Livre :</label>
                <input  type="text" value={idLivre} onChange={(e) => setIdLivre(e.target.value)} />
            </div>
            <div className={styles.content}>
                <label>IdOwner :</label>
                <input type="text" value={idOwner} onChange={(e) => setIdOwner(e.target.value)} />
            </div>
            <div className={styles.content}>
                <label>Id du Tag :</label>
                <input  type="text" value={idTag} onChange={(e) => setIdTag(e.target.value)} />
            </div>
            <div className={styles.content}>
                <label>Contenu :</label>
                <input  type="text" value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <div className={styles.content}>
                <label>URL de l'image :</label>
                <input  type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </div>
            <button className={styles.button} type="submit">Ajouter une note</button>
        </form>
    );
}

export default AddNoteForm;