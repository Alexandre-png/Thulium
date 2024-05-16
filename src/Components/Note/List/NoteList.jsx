import React from 'react';
import styles from './NoteList.module.css';

function NoteList({ notes, onDeleteNote }) {
    return (
        <section className={styles.container} id='note'>
            <h2 className={styles.title}>Liste des notes :</h2>
            <div className={styles.notes}>
                {notes.length > 0 ? (
                    notes.map(note => (
                        <li key={note.id}>
                            <p>Id : {note.id}</p>
                            <p>Contenu : {note.content}</p>
                            <p>Image URL : {note.imageUrl}</p>
                            <button onClick={() => onDeleteNote(note.id)}>Supprimer</button>
                        </li>
                    ))
                ) : (
                    <p>Aucune note disponible. Commencez par en créer une!</p>
                )}
            </div>
        </section>
    );
}

export default NoteList;