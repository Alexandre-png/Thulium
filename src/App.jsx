import styles from "./App.module.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Note } from "./Components/Note/Note";
import { AuthForm } from './Components/User/Authentification/Authentification';
import axios from 'axios';

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('authToken');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
}, function (error) {
  // Handle errors
  return Promise.reject(error);
});

function App() {
  return <div className={styles.App}>
    <Router>
      <Routes>
        <Route path="/Note" element={<Note />} />
        <Route path="/" element={<AuthForm mode="login" />} />
        <Route path="/Register" element={<AuthForm mode="register" />} />
      </Routes>
    </Router>
  </div>
}

export default App
