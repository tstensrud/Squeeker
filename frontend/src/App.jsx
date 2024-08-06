import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';


import FrontPage from './pages/FrontPage.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import Login from './pages/Login.jsx';
import SubPagePost from './pages/SubPagePost.jsx';
import Register from './pages/Register.jsx';
import SubPage from './pages/SubPage.jsx';
import CreateSubPage from './pages/CreateSubPage.jsx';

function App() {

    const {currentUser} = useContext(AuthContext);

    const RequireAuth = ({children}) => {
      return (currentUser ? (children) : <Navigate to="/login" />);
    }


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FrontPage />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="subpage/create" element={<CreateSubPage />}/>
            <Route path="subpage/:subPageName" element={<SubPage />} />
            <Route path="subpage/:subpageName/:postId" element={<SubPagePost />}/>
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
