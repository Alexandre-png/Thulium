import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

export const Login = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordErrors, setPasswordErrors] = useState({ minLengthValid: true, patternValid: true });
    const [isValidEmail, setIsValidEmail] = useState(true);
    const navigate = useNavigate();

    const handleEmailChange = (event) => {
        const inputValue = event.target.value;
        setEmail(inputValue);
        setIsValidEmail(validateEmail(inputValue));
    }

    const handlePasswordChange = (event) => {
        const { value } = event.target;
        setPassword(value);
        setPasswordErrors(validatePassword(value));
    };

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const validatePassword = (password) => {
        const minLengthValid = password.length >= 8;
        const patternValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/.test(password);
        return { minLengthValid, patternValid };
    };

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { minLengthValid, patternValid } = validatePassword(password);
        if (!isValidEmail || !minLengthValid || !patternValid) {
            console.error('Email ou mot de passe invalide.');
            return;
        }
        try {
            const response = await axios.post('/api/utilisateur', {
                firstName,
                lastName,
                email,
                password
            });
            handleLogin();
        } catch (error) {
            console.error('Erreur lors de la création du compte :', error);
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('/api/utilisateur/authentification', {
                email,  // Assurez-vous que ces paramètres correspondent à ce que votre API attend
                password
            });
            // Vous pourriez vouloir stocker un token de session ici si votre backend en renvoie un
            navigate('/Note');  // Rediriger l'utilisateur vers la page des notes
        } catch (error) {
            console.error('Erreur lors de l\'authentification :', error);
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.label}>Prénom</label>
                <input
                    type='text'
                    value={firstName}
                    onChange={handleFirstNameChange}
                    placeholder="Facultatif"
                />
                <label className={styles.label}>Nom</label>
                <input
                    type='text'
                    value={lastName}
                    onChange={handleLastNameChange}
                    placeholder="Facultatif"
                />
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
                    required
                />
                {!passwordErrors.minLengthValid && <p>Le mot de passe doit contenir au moins 8 caractères.</p>}
                {!passwordErrors.patternValid && <p>Le mot de passe doit contenir au moins un caractère spécial, une majuscule, une minuscule et un chiffre.</p>}
                <button type='submit'>Créer un compte</button>
            </form>
        </div>
    );

}