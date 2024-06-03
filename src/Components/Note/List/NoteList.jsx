import React from 'react';
import styles from './NoteList.module.css';
import placeholderImage from '../../../assets/imageFiller.png';

function NoteList({ notes, onDeleteNote, onEditNote }) {

    return (
        <section className={styles.container}>
            <div className={styles.notes}>
                {notes.length > 0 ? (
                    notes.map(note => (
                        <div key={note.id} className={styles.noteItem}>
                            <img src={note.imageUrl || placeholderImage}
                                alt={note.title}
                                className={styles.bannerImage}
                            />
                            <div className={styles.noteContent}>
                                <p className={styles.noteTitle}><strong>{note.title}</strong> </p>
                                <p className={styles.noteContent}>{note.content.substring(0, 25)}</p>
                            </div>
                            <div className={styles.buttonContainer}>
                                <button onClick={() => onEditNote(note)} className={styles.editButton}>
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
