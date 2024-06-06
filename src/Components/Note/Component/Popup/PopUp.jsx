import React, { useEffect } from 'react';
import styles from './PopUp.module.css';

const Popup = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); 

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={styles.popupContainer}>
            <div className={styles.popup}>
                {message}
            </div>
        </div>
    );
};

export default Popup;