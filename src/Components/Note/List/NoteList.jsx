import React from 'react';
import styles from './NoteList.module.css';
import { useUser } from '../../../Context/UserContext';

function NoteList({ notes, onDeleteNote }) {
    const { userId } = useUser();

    return (
        <section className={styles.container}>
            <h2 className={styles.title}>Liste des notes :</h2>
            <div className={styles.notes}>
                {notes.length > 0 ? (
                    notes.map(note => (
                        <div key={note.id} className={styles.noteItem}>
                            {note.imageUrl && (
                                <img src={note.imageUrl} alt={note.title} className={styles.noteImage} />
                            )}
                            <div className={styles.noteContent}>
                                <p className={styles.noteTitle}><strong>{note.title}</strong> </p>
                                <p>{note.content.substring(0, 25)}</p>
                            </div>
                            <div className={styles.buttonContainer}>
                                <button onClick={() => onModifyNote(note.id)} className={styles.modifyButton}>
                                    Modifier
                                </button>
                                <button onClick={() => onDeleteNote(note.id)} className={styles.deleteButton}>
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Aucune note disponible. Commencez par en créer une!</p>
                )}
            </div>
        </section>
    );
}

export default NoteList;
