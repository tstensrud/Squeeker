import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import FrontPage from './pages/FrontPage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import Login from './pages/Login.jsx';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Register from './pages/Register.jsx';

function App() {

    const {currentUser} = useContext(AuthContext);

    const RequireAuth = ({children}) => {
      return (currentUser ? (children) : <Navigate to="/login" />);
    }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route index element={<RequireAuth><FrontPage /></RequireAuth>} />
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
