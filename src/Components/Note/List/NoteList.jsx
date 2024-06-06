import React from 'react';
import ReactHtmlParser from "html-react-parser";
import DOMPurify from "dompurify";
import htmlTruncate from 'html-truncate';
import styles from './NoteList.module.css';
import placeholderImage from '../../../assets/imageFiller.png';

function NoteList({ notes, onDeleteNote, onEditNote }) {

    const truncateAndSanitize = (html, maxLength) => {
        const truncatedHtml = htmlTruncate(html, maxLength);
        return ReactHtmlParser(DOMPurify.sanitize(truncatedHtml));
    };

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
                                <p className={styles.noteTitle}><strong>{note.title}</strong></p>
                                <div className={styles.noteContent}>
                                    {truncateAndSanitize(note.content, 24)}
                                </div>
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
