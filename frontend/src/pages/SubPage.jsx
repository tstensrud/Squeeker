import { Link, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


import useFetch from '../hooks/useFetch';
import { BASE_URL } from '../utils/globalVariables';
import HeaderComponent from './components/HeaderComponent';

import Post from './components/Post';
import NewPost from './components/NewPost';
import SubPageDoesNotExist from './components/SubPageDoesNotExist';
import LoadingSpinner from './components/LoadingSpinner';

function SubPage() {
    const { subPageName } = useParams();
    const { currentUser, idToken } = useContext(AuthContext);

    const { data: subpageData, loading: subpageDataLoading, error } = useFetch(`${BASE_URL}/api/subpage/${subPageName}/`, idToken);
    const { data: subpagePostData, loading: subpagePostDataLoading, error: subpagePostDataError } = useFetch(
        subpageData ? `${BASE_URL}/api/subpage/${subpageData.data.uid}/posts/` : null,
        idToken
    );

    return (
        <>
            <br />
            {
                subpageData && subpageData.success === false ? (
                    <><SubPageDoesNotExist subPageName={subPageName} /></>
                ) : (
                    <>  
                        {
                            subpageDataLoading === true ? (
                            <>
                                <>
                                    <LoadingSpinner key={"loading1"} />
                                </>
                            </>
                            ):(
                            <>
                                <HeaderComponent subpageData={subpageData && subpageData.data} />
                            </>
                            )
                        }
                        
                        {
                            idToken && currentUser && idToken !== null && currentUser !== null ? (<><NewPost key={"newpost"} author={currentUser} subPageName={subPageName} subPageUid={subpageData && subpageData.data.uid} /></>) : ("")
                        }

                        {
                            subpagePostDataLoading && subpagePostDataLoading === true ? (
                                <>
                                    <LoadingSpinner key={"loading2"} />
                                </>
                            ) : (
                                <>
                                    {
                                        subpagePostDataLoading && subpagePostDataLoading === true ? (
                                            <>
                                                <>
                                                    <LoadingSpinner key={"loading3"} />
                                                </>
                                            </>
                                        ) : (
                                        <>
                                            {
                                                subpagePostData && subpagePostData.data !== undefined && Object.keys(subpagePostData.data).map((key, index) => (
                                                    <>
                                                        <Post postData={subpagePostData.data[key]} key={index} />
                                                    </>
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