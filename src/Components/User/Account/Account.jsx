import React, { useState } from 'react';
import styles from './Account.module.css';
import Popup from '../../Note/Component/Popup/PopUp';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const Account = ({ user }) => {
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState('');
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(true);

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("http://localhost:5100"+user.profileImageUrl || '');

    const [popupMessage, setPopupMessage] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isModified, setIsModified] = useState(false);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setIsValidEmail(validateEmail(event.target.value));
        setIsModified(true);
    };

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setPasswordErrors(validatePassword(event.target.value));
        setIsModified(true);
    };

    const handlePasswordFocus = () => {
        setPasswordFocused(true);
    };

    const handlePasswordBlur = () => {
        setPasswordFocused(false);
    };

    const validatePassword = (password) => {
        let errors = [];
        if (password.length < 6) errors.push("- 6 caractères.");
        if (!/[^\w\s]/.test(password)) errors.push("- un caractère spécial");
        if (!/[A-Z]/.test(password)) errors.push("- une majuscule");
        if (!/[a-z]/.test(password)) errors.push("- une minuscule");
        if (!/\d/.test(password)) errors.push("- un chiffre");
        return errors;
    };

    const handleDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        const preview = URL.createObjectURL(file);
        setImageFile(file);
        setImagePreview(preview);
        setIsModified(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        if (email !== user.email) formData.append('email', email);
        if (password) formData.append('password', password);
        if (imageFile) formData.append('profileImage', imageFile);

        try {
            const response = await axios.put('/api/Utilisateur/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
                }
            });
            showPopup('Mise à jour réussie');
        } catch (error) {
            showPopup('Erreur lors de la mise à jour');
            console.error('Error updating user:', error);
        }
    };

    const showPopup = (message) => {
        setPopupMessage(message);
        setIsPopupOpen(true);
        setTimeout(() => {
            setIsPopupOpen(false);
        }, 3000);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleDrop });

    return (
        <div className={styles.container}>
            <h2>Mon Compte</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formContent}>
                    <div className={styles.formLeft}>
                        <label className={styles.label}>Email *</label>
                        <input
                            type='email'
                            value={email}
                            onChange={handleEmailChange}
                            className={!isValidEmail ? styles.invalid : ''}
                            required
                        />

                        <label className={styles.label}>Mot de passe *</label>
                        <input
                            type='password'
                            value={password}
                            onChange={handlePasswordChange}
                            onFocus={handlePasswordFocus}
                            onBlur={handlePasswordBlur}
                        />
                        {passwordFocused && passwordErrors.length > 0 && (
                            <div className={styles.passwordRequirements}>
                                <p>Le mot de passe doit contenir au moins :</p>
                                <ul className={styles.passwordSpecificRequirements}>
                                    {passwordErrors.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className={styles.formRight}>
                        <div {...getRootProps()} className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}>
                            <input {...getInputProps()} />
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className={styles.image} />
                            ) : (
                                <p>Déposez une image ici, ou cliquez pour sélectionner une image</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.submitButtonContainer}>
                    <button type='submit' className={styles.submitButton}>
                        Mettre à jour
                    </button>
                </div>

                {isPopupOpen && (
                    <Popup
                        message={popupMessage}
                        onClose={() => setIsPopupOpen(false)}
                    />
                )}
            </form>
        </div>
    );
}

export default Account;
