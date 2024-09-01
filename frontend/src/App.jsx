import { HashRouter as Router, BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
import UserAccount from './pages/user/UserAccount.jsx';
import Messages from './pages/user/Messages.jsx';

function App() {

  const { currentUser } = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return (currentUser ? (children) : <Navigate to="/" />);
  }


  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />}>
          <Route path="/" element={<FrontPageContent />} />
          <Route path="account" element={<UserAccount index={4} />} />
          <Route path="messages" element={<Messages index={5} />} />
          <Route path="about" element={<About index={3} />} />
          <Route path="reset" element={<ForgottenPassword />} />
          {/* <Route index element={ <RequireAuth> <FrontPage /> </RequireAuth>}/> */}
          <Route path="rooms" element={<Subpages index={1} />} />
          <Route path="room/create" element={<CreateSubPage index={2} />} />
          <Route path="room/:subPageName" element={<SubPage index={1} />} />
          <Route path="room/:subPageName/post/:postId" element={<SubPagePost index={1} />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  )
}

export default App
