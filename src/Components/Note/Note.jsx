import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteList from './List/NoteList';
import AddNoteForm from './Create/AddNoteForm';
import styles from './Note.module.css';

export const Note = () => {
    const [notes, setNotes] = useState([]);
    const [userId, setUserId] = useState('');



    // Fonction pour récupérer les notes de l'utilisateur
    const fetchNotes = async () => {
        try {
            const response = await axios.get(`http://localhost:5100/api/Note/${userId}/notes`);
            setNotes(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des notes:', error);
        }
    };

    // Effet pour charger les notes lorsque l'ID utilisateur change
    useEffect(() => {
        fetchNotes();
    }, [userId]);

    // Fonction pour ajouter une note
    const handleAddNote = () => {
        // Mettre à jour la liste des notes après l'ajout d'une nouvelle note
        fetchNotes();
    };

    // Fonction pour supprimer une note
    const handleDeleteNote = async (id) => {
        try {
            await axios.delete(`http://localhost:5100/api/Note/${id}`);
            setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
        } catch (error) {
            console.error('Erreur lors de la suppression de la note:', error);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Gestion des notes</h1>
            <div className={styles.notes}>
                <NoteList notes={notes} onDeleteNote={handleDeleteNote} />
            </div>
            <AddNoteForm onAddNote={handleAddNote} />

            <h1 className={styles.title}>Test </h1>
            <label className={styles.subtitle}>Entrez l'ID de l'utilisateur :</label>
            <input type="text" className={styles.input} value={userId} onChange={(e) => setUserId(e.target.value)} />
        </div>
    );

}