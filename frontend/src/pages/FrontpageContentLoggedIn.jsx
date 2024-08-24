import { Link } from "react-router-dom";

// Hooks
import useFetch from '../hooks/useFetch';
import { BASE_URL } from '../utils/globalVariables';

// Components
import LoadingBar from './components/LoadingBar';
import LoadingSpinner from './components/LoadingSpinner';

function FrontpageContentLoggedIn({currentUser, idToken}) {
    
    const { data, loading, error } = useFetch(`${BASE_URL}/api/frontpage/${currentUser.uid}/`, idToken);

    return (
        <>
            
     asdf
                <LoadingSpinner />
            
        </>
    );
}

export default FrontpageContentLoggedIn;