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
    const [formMode, setFormMode] = useState(null);
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

    const handleDeleteNote = async (id) => {
        try {
            await axios.delete(`/api/Note/${id}`);
            setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
        } catch (error) {
            console.error('Erreur lors de la suppression de la note:', error);
        }
    };

    const handleAddNote = async () => {
        fetchNotes();
        setShowAddForm(false);
        setFormMode(null);
    };

    const handleEditNote = async () => {
        fetchNotes();
    };

    const startAddingNote = () => {
        setShowAddForm(true);
        setEditingNote(null);
        setFormMode('add');
    };

    const startEditingNote = (note) => {
        setEditingNote(note);
        setShowAddForm(false);
        setFormMode('edit');
    };

    useEffect(() => {
        if (userId) {
            fetchNotes();
        }
    }, [userId]);

    const goBackToList = () => {
        setShowAddForm(false);
        setEditingNote(null);
        setFormMode(null);
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.brandName}>Scribeo /</h1>
                <h1 className={styles.title}>
                    {formMode === 'add' ? "Écriture" : formMode === 'edit' ? "Modifier la note" : "Mes notes"}
                </h1>
            </div>
            <button onClick={formMode ? goBackToList : startAddingNote} className={styles.floatingButton}>
                {formMode ? "Retourner à mes notes" : "Ajouter une note"}
            </button>
            {formMode === 'add' ? (
                <div className={styles.centerForm}>
                    <AddNoteForm onAddNote={handleAddNote} />
                </div>
            ) : formMode === 'edit' ? (
                <div className={styles.centerForm}>
                    <EditNoteForm note={editingNote} onEditNote={handleEditNote} />
                </div>
            ) : (
                <NoteList notes={notes} onDeleteNote={handleDeleteNote} onEditNote={startEditingNote} />
            )}
        </div>
    );
}