// Hooks and utils
import { AuthContext } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';

// Components
import Post from './components/Post.jsx';
import LoadingBar from './components/LoadingBar';
import { useContext } from "react";

function FrontpageContentLoggedIn() {
    const { currentUser, idToken, loading: authLoading } = useContext(AuthContext);
    const { data, loading, error } = useFetch(!authLoading && currentUser ? `api/frontpage/${currentUser.uid}/50/` : null);

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
                                        data?.data && Object.keys(data.data).map((key, index) => (
                                            <Post key={index} postData={data.data[key]} />
                                        ))
                                    }
                                </>
                            ) : (
                                <>
                                    {data?.message}
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