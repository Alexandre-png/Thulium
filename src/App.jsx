import styles from "./App.module.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Note } from "./Components/Note/Note";
import { Login } from "./Components/User/Login/Login"

function App() {
  return <div className={styles.App}>
    <Router>
      <Routes>
        <Route path="/Note" element={<Note />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  </div>
}

export default App
