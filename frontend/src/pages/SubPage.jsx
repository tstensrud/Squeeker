import { Link, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

import Post from './components/Post';
import NewPost from './components/NewPost';
import SubPageDoesNotExist from './components/SubPageDoesNotExist';
import useFetch from '../hooks/useFetch';
import { BASE_URL } from '../utils/globalVariables';
import HeaderComponent from './components/HeaderComponent';

function SubPage() {
    const { subPageName } = useParams();
    const [existingSubPage, setExistingSubPage] = useState(false);
    const [subPageId, setSubPageId] = useState("");
    const { currentUser, idToken } = useContext(AuthContext);

    const { data, loading, error } = useFetch(`${BASE_URL}/api/subpage/${subPageName}/`, idToken)

  


    return (
        <>
            <br />
            {
                data && data.success === false ? (
                    <><SubPageDoesNotExist subPageName={subPageName} /></>
                ) : (
                    <>
                        <HeaderComponent title={subPageName} description={data && data.data.description} />
                        <NewPost subPageName={subPageName} />
                    </>
                )
            }
        </>
    );
}

export default SubPage;