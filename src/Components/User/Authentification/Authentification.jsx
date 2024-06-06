import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Authentification.module.css';
import Popup from '../../Note/Component/Popup/PopUp';


export const Authentification = ({ mode }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const navigate = useNavigate();

    const [popupMessage, setPopupMessage] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setIsValidEmail(validateEmail(event.target.value));
    };

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setPasswordErrors(validatePassword(event.target.value));
    };

    const handlePasswordFocus = () => {
        setPasswordFocused(true);
    };

    const handlePasswordBlur = () => {
        setPasswordFocused(false);
    };

    const showPopup = (message) => {
        setPopupMessage(message);
        setIsPopupOpen(true);
        setTimeout(() => {
            setIsPopupOpen(false);
        }, 3000);
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isValidEmail || passwordErrors.length > 0) {
            console.error('Email ou mot de passe invalide.');
            showPopup('Email ou mot de passe invalide');
            return;
        }

        const url = mode === 'login' ? '/api/Utilisateur/login' : '/api/Utilisateur/register';
        const successRedirect = mode === 'login' ? '/Note' : '/';

        try {
            const response = await axios.post(url, { email, password });
            const { token } = response.data;
            storeToken(token);
            navigate(successRedirect);
        } catch (error) {
            console.error(`Erreur lors de ${mode} :`, error);
            if (mode == 'login') {
                showPopup(`Erreur lors de la connexion, l'email et/ou mot de passe est invalide`);
            } else {
                showPopup(`Erreur lors de l'inscription, l'email et/ou mot de passe est invalide`);
            }
        }
    };

    const storeToken = (token) => {
        sessionStorage.setItem('authToken', token);
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.label}>Email *</label>
                <input type='email' value={email} onChange={handleEmailChange} className={!isValidEmail ? styles.invalid : ''} required />
                <label className={styles.label}>Mot de passe *</label>
                <input type='password' value={password} onChange={handlePasswordChange} onFocus={handlePasswordFocus} onBlur={handlePasswordBlur} required />
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
                {isPopupOpen && (
                    <Popup
                        message={popupMessage}
                        onClose={() => setIsPopupOpen(false)}
                    />
                )}
                <button type='submit' className={styles.submitButton}>
                    {mode === 'login' ? 'Se connecter' : 'S\'inscrire'}
                </button>
                {mode === 'login' ? <p>Pas de compte ? <Link to="/Register">Inscrivez-vous ici</Link></p> : <p>Déjà un compte ? <Link to="/">Connectez-vous ici</Link></p>}
            </form>
        </div>
    );
};