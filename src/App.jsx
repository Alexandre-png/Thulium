import styles from "./App.module.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Note } from "./Components/Note/Note";
import { Authentification } from './Components/User/Authentification/Authentification';
import axios from 'axios';
import { UserProvider } from './Context/UserContext';
import { jwtDecode } from "jwt-decode";


axios.interceptors.request.use(config => {
  if (config.url.includes('/api/Utilisateur/register') || config.url.includes('/api/Utilisateur/login')) {
    return config;
  }
  const token = sessionStorage.getItem('authToken');
  if (token) {
    const decodedToken = jwtDecode(token);
    const userId = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    config.headers.Authorization = `Bearer ${token}`;
    config.headers.userId = userId;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

function App() {
  return (
    <div className={styles.App}>
      <Router>
        <UserProvider>
          <Routes>
            <Route path="/Note" element={<Note />} />
            <Route path="/" element={<div className={styles.authContainer}><Authentification mode="login" /></div>} />
            <Route path="/Register" element={<div className={styles.authContainer}><Authentification mode="register" /></div>} />
          </Routes>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App
