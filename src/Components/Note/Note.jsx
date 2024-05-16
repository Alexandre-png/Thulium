import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteList from './List/NoteList';
import AddNoteForm from './Create/AddNoteForm';
import styles from './Note.module.css';
import { useUser } from '../../Context/UserContext';

export const Note = () => {
    const [notes, setNotes] = useState([]);
    const { userId } = useUser();


    const fetchNotes = async () => {
        if (!userId) return;
        try {
            const response = await axios.get(`/api/Note/${userId}/notes`);
            setNotes(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des notes:', error);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchNotes();
        }
    }, [userId]);

    // Fonction pour ajouter une note
    const handleAddNote = async () => {
        fetchNotes();
    };

    // Fonction pour supprimer une note
    const handleDeleteNote = async (id) => {
        try {
            await axios.delete(`/api/Note/${id}`);
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
        </div>
    );

}