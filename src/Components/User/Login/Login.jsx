import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

export const Login = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);
    const navigate = useNavigate();

    // Gestionnaire d'événements pour le champ d'entrée
    const handleEmailChange = (event) => {
        const inputValue = event.target.value;
        const isValid = validateEmail(inputValue);
        setEmail(inputValue);
        setIsValidEmail(isValid);
    }

    // Fonction pour valider un email
    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };


    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isValidEmail || !password) {
            console.error('Email ou mot de passe invalide.');
            return;
        }
        try {
            const response = await axios.post('/api/utilisateur/CreateUtilisateur', {
                firstName,
                lastName,
                email,
                password
            });
            navigate('/Note');
        } catch (error) {
            console.error('Erreur lors de la création du compte :', error);
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('/api/utilisateur/authentification', {
                emailOrUsername,
                password
            });

            history.push('/Note');
        } catch (error) {
            // Afficher un message d'erreur à l'utilisateur
            console.error('Erreur lors de l\'authentification :', error);
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.firstName}>
                    <label>Prénom (facultatif) </label>
                    <input type='text' value={firstName} onChange={handleFirstNameChange} />
                </div>
                <div className={styles.lastName}>
                    <label>Nom (facultatif) </label>
                    <input type='text' value={lastName} onChange={handleLastNameChange} />
                </div>
                <div className={styles.email}>
                    <label>Email </label>
                    <input
                        type='email'
                        value={email}
                        onChange={handleEmailChange}
                        className={!isValidEmail ? styles.invalid : ''}
                    />
                </div>
                <div className={styles.password}>
                    <label>Mot de passe </label>
                    <input type='password' value={password} onChange={handlePasswordChange} />
                </div>
                <button type='submit'>Créer un compte</button>
            </form>
        </div>
    );

}