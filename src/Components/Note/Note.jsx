import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteList from './List/NoteList';
import AddNoteForm from './Create/AddNoteForm';
import EditNoteForm from './Edit/EditNoteForm';
import styles from './Note.module.css';
import { useUser } from '../../Context/UserContext';

export const Note = () => {
    const [notes, setNotes] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
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


    const handleAddNote = async () => {
        fetchNotes();
    };


    const handleDeleteNote = async (id) => {
        try {
            await axios.delete(`/api/Note/${id}`);
            setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
        } catch (error) {
            console.error('Erreur lors de la suppression de la note:', error);
        }
    };

    const handleEditNote = (note) => {
        setEditingNote(note);
        setShowAddForm(false);
    };

    useEffect(() => {
        if (userId) {
            fetchNotes();
        }
    }, [userId]);

    const toggleForm = () => {
        setShowAddForm(!showAddForm);
        setEditingNote(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.brandName}>Scribeo /</h1>
                <h1 className={styles.title}>{showAddForm ? "Écriture" : "Mes notes"} </h1>
            </div>
            <button onClick={toggleForm} className={styles.floatingButton}>
                {showAddForm || editingNote ? "Retourner à mes notes" : "Ajouter une note"}
            </button>
            {showAddForm ? (
                <AddNoteForm onAddNote={handleAddNote} />
            ) : editingNote ? (
                <EditNoteForm note={editingNote} onEditNote={handleAddNote} />
            ) : (
                <NoteList notes={notes} onDeleteNote={handleDeleteNote} onEditNote={handleEditNote} />
            )}
        </div>
    );

}