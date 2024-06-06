import React, { useState, useEffect } from 'react';
import styles from './Profile.module.css';

function Profile({onLogOut, onEditAccount, onListNote}) {
    const [isOpen, setIsOpen] = useState(false);

    const handleMouseEnter = () => {
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        setIsOpen(false);
    };

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (isOpen && !event.target.closest(`.${styles.dropdown}`)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [isOpen]);

    return (
        <div className={styles.dropdown} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <h1 className={styles.dropdownButton} onClick={handleClick}> <span className={styles.arrow}>&#9662;</span> Scribeo/ </h1>
            {isOpen && (
                <div className={styles.dropdownContent}>
                    <a onClick={() => onEditAccount()}>Mon compte</a>
                    <a onClick={() => onListNote()}>Mes notes</a>
                    <a onClick={() => onLogOut()}>Se déconnecter</a>
                </div>
            )}
        </div>
    );
};
export default Profile;


