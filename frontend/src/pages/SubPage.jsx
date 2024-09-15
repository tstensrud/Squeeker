import { Link, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


// Hooks and globals
import useFetch from '../hooks/useFetch';

// Components
import HeaderComponent from './components/HeaderComponent';
import Post from './components/Post';
import NewPost from './components/NewPost';
import SubPageDoesNotExist from './components/SubPageDoesNotExist';
import LoadingSpinner from './components/LoadingSpinner';
import { GlobalContext } from '../context/GlobalContext';
import LoadingBar from './components/LoadingBar';

function SubPage(props) {
    const { subPageName } = useParams();
    const { currentUser, idToken } = useContext(AuthContext);
    const { setSelectedIndex } = useContext(GlobalContext);

    // Initial fetches
    const { data: subpageData, loading: subpageDataLoading, error, refetch: refetchSubpageData } = useFetch(`api/subpage/${subPageName}/`);

    const { data: subpagePostData, loading: subpagePostDataLoading, error: subpagePostDataError } = useFetch(
        subpageData?.data?.subpage_data ? `api/subpage/${subpageData.data.subpage_data.uid}/posts/` : null);

    useEffect(() => {
        setSelectedIndex(props.index);
    }, []);
    
    return (
        <>
            {
                subpageData?.success === false ? (
                    <SubPageDoesNotExist subPageName={subPageName} />
                ) : (
                    <>
                        {
                            subpageDataLoading === true ? (
                                <LoadingBar />
                            ) : (
                                <HeaderComponent totalSubs={subpageData?.data?.subpage_data?.total_subs} isSubscribed={subpageData?.data?.is_subscribed} subpageData={subpageData?.data?.subpage_data} />
                            )
                        }

                        {
                            idToken && currentUser && idToken !== null && currentUser !== null ? (
                            <NewPost refetchSubpageData={refetchSubpageData} author={currentUser} subPageName={subPageName} subPageUid={subpageData?.data?.subpage_data?.uid} />
                        ) : ("")
                        }


                        {
                            subpagePostDataLoading && subpagePostDataLoading === true ? (
                                <LoadingSpinner text="posts" />
                            ) : (
                                <>
                                    {
                                        subpagePostData && subpagePostData.data !== undefined && Object.keys(subpagePostData.data).map((key, index) => (
                                            <Post postData={subpagePostData.data[key]} key={`${subpagePostData.data[key].uid} + ${index}`} />
                                        ))
                                    }
                                    {
                                        subpagePostData?.success === false && 
                                        <div className="mt-5">
                                            {subpagePostData?.message}
                                        </div>
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