# Scribeo Front-End

## Description

Scribeo est une application de prise de notes inspirée de Pinterest. Ce dépôt contient le code du front-end, développé avec React.js et utilisant Tailwind CSS pour le style.

## Fonctionnalités

- Authentification des utilisateurs
- Création, modification et suppression de notes
- Gestion des images pour les notes
- Affichage des notes de l'utilisateur
- Gestion du compte utilisateur (modification des informations et de l'image de profil)

## Dépendances

- `react` : Bibliothèque JavaScript pour la création d'interfaces utilisateur
- `react-dom` : Fournit des méthodes spécifiques au DOM qui s'intègrent avec React
- `react-router-dom` : Utilisé pour la gestion des routes dans l'application
- `axios` : Utilisé pour faire des requêtes HTTP vers l'API back-end
- `react-quill` : Éditeur de texte riche basé sur Quill
- `html-react-parser` : Parse HTML en React
- `dompurify` : Purifie le HTML pour prévenir les attaques XSS
- `tailwindcss` : Utilisé pour le style

Pour voir toutes les dépendances, consultez le fichier `package.json`.

## Installation

### Prérequis

- Node.js et npm doivent être installés sur votre machine.

### Étapes d'installation

1. Clonez le dépôt
   ```bash
   git clone https://github.com/votre-utilisateur/votre-repo-frontend.git

2. Installez les dépendances
   npm install

3. Démarrez l'application
   npm start

## Structure du Projet :
 |-> src/ : Contient le code source de l'application
     |-> App.jsx : Composant principal de l'application
     |-> Context : Contient des fonctions JSX pour obtenir un context (l'id utilisateur par exemple)
     |-> Components : Composants principal de l'application
        |-> Note : Composants pour le système de note
        |-> User : Composants pour le système d'utilisateur
     |-> Assets : Composant principal de l'application

## Contribution
Les contributions sont les bienvenues ! Veuillez ouvrir une issue pour discuter des changements que vous souhaitez apporter.
 
   
