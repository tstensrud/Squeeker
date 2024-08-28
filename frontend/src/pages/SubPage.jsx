import { Link, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


// Hooks and globals
import useFetch from '../hooks/useFetch';
import useFetchNoLogin from '../hooks/useFetchNoLogin';
import { BASE_URL } from '../utils/globalVariables';

// Components
import HeaderComponent from './components/HeaderComponent';
import Post from './components/Post';
import NewPost from './components/NewPost';
import SubPageDoesNotExist from './components/SubPageDoesNotExist';
import LoadingSpinner from './components/LoadingSpinner';
import { GlobalContext } from '../context/GlobalContext';

function SubPage(props) {
    const { subPageName } = useParams();
    const { currentUser, idToken } = useContext(AuthContext);
    const { setSelectedIndex } = useContext(GlobalContext);

    // Initial fetches
    const { data: subpageData, loading: subpageDataLoading, error, refetch: refetchSubpageData } = useFetch(`${BASE_URL}/api/subpage/${subPageName}/`, idToken);

    const { data: subpagePostData, loading: subpagePostDataLoading, error: subpagePostDataError } = useFetch(
        subpageData && subpageData.data ? `${BASE_URL}/api/subpage/${subpageData.data.uid}/posts/` : null,
        idToken
    );
    
    useEffect(() => {
        setSelectedIndex(props.index);
    },[]);
    
    return (
        <>
            {
                subpageData && subpageData.success === false ? (
                    <SubPageDoesNotExist subPageName={subPageName} />
                ) : (
                    <>
                        {
                            subpageDataLoading === true ? (
                                <LoadingSpinner key={"loading1"} />
                            ) : (
                                <HeaderComponent key={"header"} subpageData={subpageData && subpageData.data} />
                            )
                        }

                        {
                            idToken && currentUser && idToken !== null && currentUser !== null ? (<><NewPost key={"newpost"}  refetchSubpageData={refetchSubpageData} author={currentUser} subPageName={subPageName} subPageUid={subpageData && subpageData.data.uid} /></>) : ("")
                        }

                        {
                            subpagePostDataLoading && subpagePostDataLoading === true ? (
                                <LoadingSpinner key={"loading2"} />
                            ) : (
                                <>
                                    {
                                        subpagePostDataLoading && subpagePostDataLoading === true ? (
                                            <LoadingSpinner key={"loading3"} />
                                        ) : (
                                            <>
                                                {
                                                    subpagePostData && subpagePostData.data !== undefined && Object.keys(subpagePostData.data).map((key, index) => (
                                                        <Post postData={subpagePostData.data[key]} key={`${subpagePostData.data[key].uid} + ${index}`} />
                                                    ))
                                                }
                                            </>
                                        )
                                    }
                                </>
                            )
                        }
                    </>
                )
            }
        </>
    );
}

export default SubPage;