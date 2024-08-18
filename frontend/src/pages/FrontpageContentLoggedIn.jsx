import { Link } from "react-router-dom";

// Hooks
import useFetch from '../hooks/useFetch';
import { BASE_URL } from '../utils/globalVariables';

function FrontpageContentLoggedIn({currentUser, idToken}) {
    
    const { data, loading, error } = useFetch(`${BASE_URL}/api/frontpage/${currentUser.uid}/`, idToken);

    return (
        <>
        
        </>
    );
}

export default FrontpageContentLoggedIn;