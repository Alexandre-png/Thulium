import React from 'react';
import styles from './NoteList.module.css';

function NoteList({ notes, onDeleteNote }) {
    return (
        <section className={styles.container}>
            <h2 className={styles.title}>Liste des notes :</h2>
            <div className={styles.notes}>
                {notes.length > 0 ? (
                    notes.map(note => (
                        <div key={note.id} className={styles.noteItem}>
                            <img src={note.imageUrl || 'path_to_default_image.jpg'} className={styles.noteImage} alt="Note" />
                            <div className={styles.noteContent}>
                                <p><strong>Titre :</strong> {note.title}</p>
                                <p><strong>Contenu :</strong> {note.content.substring(0, 100)}...</p>  {/* Affiche les 100 premiers caractères */}
                            </div>
                            <div className={styles.buttonContainer}>
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
