import React, { useEffect } from 'react';
import styles from './PopUp.module.css';

const Popup = ({ message, onClose }) => {

    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popup}>
                {message}
            </div>
        </div>
    );
};

export default Popup;
