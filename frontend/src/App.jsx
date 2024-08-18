import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';


import FrontPage from './pages/FrontPage.jsx';
import FrontPageContent from './pages/FrontpageContent.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import SubPagePost from './pages/SubPagePost.jsx';

import SubPage from './pages/SubPage.jsx';
import CreateSubPage from './pages/CreateSubPage.jsx';
import ForgottenPassword from './pages/ForgottenPassword.jsx';
import Subpages from './pages/Subpages.jsx';
import About from './pages/About.jsx';

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
            <Route path="/" element={<FrontPageContent />}/>
            <Route path="about" element={<About />}/>
            <Route path="reset" element={<ForgottenPassword />}/>
            {/* <Route index element={ <RequireAuth> <FrontPage /> </RequireAuth>}/> */}
            <Route path="rooms" element={<Subpages />}/>
            <Route path="room/create" element={<CreateSubPage />}/>
            <Route path="room/:subPageName" element={<SubPage />} />
            <Route path="room/:subPageName/post/:postId" element={<SubPagePost />}/>
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
