import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Authentification.module.css';

export const AuthForm = ({ mode }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordErrors, setPasswordErrors] = useState({ minLengthValid: true, patternValid: true });
    const [isValidEmail, setIsValidEmail] = useState(true);
    const navigate = useNavigate();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setIsValidEmail(validateEmail(event.target.value));
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setPasswordErrors(validatePassword(event.target.value));
    };

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const validatePassword = (password) => {
        const minLengthValid = password.length >= 6;
        const patternValid = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/.test(password);
        return { minLengthValid, patternValid };
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isValidEmail || !passwordErrors.minLengthValid || !passwordErrors.patternValid) {
            console.error('Email ou mot de passe invalide.');
            return;
        }

        const url = mode === 'login' ? '/api/Utilisateur/login' : '/api/Utilisateur/register';
        const successRedirect = mode === 'login' ? '/Note' : '/Login';

        try {
            const response = await axios.post(url, { email, password });
            const { token } = response.data;
            storeToken(token);
            navigate(successRedirect);
        } catch (error) {
            console.error(`Erreur lors de ${mode} :`, error);
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
                <input type='password' value={password} onChange={handlePasswordChange} required />
                {!passwordErrors.minLengthValid && <p>Le mot de passe doit contenir au moins 6 caractères.</p>}
                {!passwordErrors.patternValid && <p>Le mot de passe doit contenir au moins un caractère spécial, une majuscule, une minuscule et un chiffre.</p>}
                <button type='submit' className={styles.submitButton}>
                    {mode === 'login' ? 'Se connecter' : 'S\'inscrire'}
                </button>
                {mode === 'login' ? <p>Pas de compte ? <Link to="/Register">Inscrivez-vous ici</Link></p> : <p>Déjà un compte ? <Link to="/">Connectez-vous ici</Link></p>}
            </form>
        </div>
    );
};