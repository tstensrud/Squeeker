import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './css/index.css';
import './css/forms.css';
import './css/widgets.css';
import './css/navbar.css';
import { AuthContextProvider } from './context/AuthContext';
import { GlobalProvider } from './context/GlobalContext.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <GlobalProvider>
        <App />
      </GlobalProvider>
    </AuthContextProvider>
  </React.StrictMode>,
)
