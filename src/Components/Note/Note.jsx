import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteList from './List/NoteList';
import AddNoteForm from './Create/AddNoteForm';
import EditNoteForm from './Edit/EditNoteForm';
import Profile from '../User/Profile/Profile';
import styles from './Note.module.css';
import { useUser } from '../../Context/UserContext';
import Account from '../User/Account/Account';

export const Note = () => {
    const [notes, setNotes] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showAccountForm, setShowAccountForm] = useState(false);
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

    const fetchUser = async () => {
        if (!userId) return;
        try {
            const token = sessionStorage.getItem('authToken');
            if (!token) {
                console.error('Token not found');
                return;
            }

            const response = await axios.get(`/api/Utilisateur/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUserInfo(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des informations utilisateur:', error);
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
        setShowAccountForm(false);
        setFormMode(null);
    };

    const handleEditNote = async () => {
        fetchNotes();
    };

    const handleLogOut = () => {

    }

    const handleEditAccount = () => {
        fetchUser();
        setShowAccountForm(true);
        setEditingNote(null);
        setShowAddForm(false);
        setFormMode('account');
    }

    const goBackToList = () => {
        setShowAddForm(false);
        setEditingNote(null);
        setShowAccountForm(false);
        setFormMode(null);
    }

    const startAddingNote = () => {
        setShowAddForm(true);
        setEditingNote(null);
        setShowAccountForm(false);
        setFormMode('add');
    };

    const startEditingNote = (note) => {
        setEditingNote(note);
        setShowAddForm(false);
        setShowAccountForm(false);
        setFormMode('edit');
    };

    useEffect(() => {
        if (userId) {
            fetchNotes();
        }
    }, [userId]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Profile onLogOut={handleLogOut} onEditAccount={handleEditAccount} onListNote={goBackToList} />
                <h1 className={styles.title}>
                    {formMode === 'add' ? "Écriture" : formMode === 'edit' ? "Modifier" : formMode === 'account' ? "Compte" : "Notes"}
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
            ) : formMode === 'account' ? (
                <div className={styles.centerForm}>
                    <Account user={userInfo} />
                </div>
            ) : (
                <NoteList notes={notes} onDeleteNote={handleDeleteNote} onEditNote={startEditingNote} />
            )}
        </div>
    );
}