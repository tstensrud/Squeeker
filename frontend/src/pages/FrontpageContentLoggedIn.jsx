import { Link } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';

// Hooks
import useFetch from '../hooks/useFetch';
import { BASE_URL } from '../utils/globalVariables';

// Components
import Post from './components/Post.jsx';
import HeaderComponent from './components/HeaderComponent.jsx';
import LoadingBar from './components/LoadingBar';
import LoadingSpinner from './components/LoadingSpinner';
import { useContext } from "react";

function FrontpageContentLoggedIn() {
    const { currentUser, idToken } = useContext(AuthContext);
    const { data, loading, error } = useFetch(`${BASE_URL}/api/frontpage/${currentUser.uid}/50/`, idToken);

    return (
        <>
            {
                loading && loading === true ? (
                    <LoadingBar />
                ) : (
                    <>
                        {
                            data && data.success === true ? (
                                <>

                                    {
                                        data && data.data && Object.keys(data.data).map((key, index) => (
                                            <Post key={index} postData={data.data[key]} />
                                        ))
                                    }
                                </>
                            ) : (
                                <>
                                    {data.message}
                                </>
                            )
                        }
                    </>
                )
            }



        </>
    );
}

export default FrontpageContentLoggedIn;