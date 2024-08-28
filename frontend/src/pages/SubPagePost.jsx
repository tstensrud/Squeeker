import { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';
import { GlobalContext } from '../context/GlobalContext';
import useFetchDemand from '../hooks/useFetchDemand';
import useFetch from '../hooks/useFetch';
import { BASE_URL } from '../utils/globalVariables';

// Components
import NewComment from './components/NewComment';
import LoadingSpinner from './components/LoadingSpinner';
import Comment from './components/Comment';
import Votebox from './components/VoteBox';
import PostReplyShareDeleteButton from './components/formcomponents/PostReplyShareDeleteButton';
import useDelete from '../hooks/useDelete';

function SubPagePost(props) {

    const { subPageName, postId } = useParams();
    const { currentUser, idToken } = useContext(AuthContext);
    const { setSelectedIndex } = useContext(GlobalContext);
    
    // useStates
    const [subpageUid, setSubpageUid] = useState("");
    const [newCommentUid, setNewCommentUid] = useState(null);
    const [deleteData, setDeleteData] = useState({});
    const [deletePostError, setDeleteError] = useState("");

    // Initial fetches
    const { data: subpageData, loading: subpageDataLoading, error: subpageDataError } = useFetch(`${BASE_URL}/api/subpage/${subPageName}/`, idToken);
    const { data: commentData, loading: commentDataLoading, error: commentDataError, refetch: commentDataRefech } = useFetch(`${BASE_URL}/api/subpage/post/${postId}/comments/`, idToken);
    const { data: postData, loading: postDataLoading, error: postDataError, refetch: refetchPostData } = useFetch(
        postId ? `${BASE_URL}/api/subpage/post/${postId}/` : null, idToken);

    // To refetch the uers latest comment
    const { data: latestCommentData, loading: latestCommentLoading, error: latestCommentError, fetchData } = useFetchDemand(
        newCommentUid ? `${BASE_URL}/api/subpage/get_comment/${newCommentUid}/` : null, idToken);

    // Delete post content
    const {response: deleteResponse, error: deleteError, deleteEntry } = useDelete(`${BASE_URL}/api/subpage/post/delete/${postId}/`, idToken);
    
    // useEffects
    useEffect(() => {
        setDeleteData({author_uuid: postData?.data?.author_uuid});
    },[postData]);

    useEffect(() => {
        setSubpageUid(subpageData && subpageData.data.uid)
    }, [subpageData])

    useEffect(() => {
        setSelectedIndex(props.index);
    },[]);

    useEffect(() => {
        if (deleteResponse?.success === true) {
            refetchPostData();
        } else {
            setDeleteError(deleteResponse?.message);
        }
    },[deleteResponse])
    // If the user leaves a comment, this will trigger a fetch of that comment so that it is visible to the user immediately
    useEffect(() => {
        const fetchLatestComment = async () => {
            if (newCommentUid !== null && newCommentUid !== undefined) {
                try {
                    await fetchData();
                }
                catch (err) {
                    console.error(err)
                }
            }
        }
        fetchLatestComment();
    }, [newCommentUid]);

    const handleDeletePost = async (e) => {
        e.preventDefault();
        await deleteEntry(deleteData);
    }

    return (
        <> 
            {
                postDataLoading && postDataLoading === true ? (<LoadingSpinner key={"loadingspinner1"} />
                ) : (
                    <>
                        <div className="post-title-card">
                            <div className="flex flex-col pt-1 w-12 justify-start items-center">
                                <Votebox refetch={refetchPostData} post={true} postData={postData && postData.data} />
                            </div>
                            <div className="flex flex-col">
                                <div className="text-xl mb-1">
                                    {postData && postData.data.title}
                                </div>
                                <div className="text-base text-post-content-color">
                                    {postData && postData.data.post}
                                </div>
                                <div>
                                    <ul className="p-0 m-0 list-none">
                                        <li className="inline mr-3 text-xs tracking-wide text-grey-text">
                                            Last modified at: {postData && postData.data.event_timestamp}
                                        </li>
                                        <li className="inline mr-3 text-xs tracking-wide text-grey-text">
                                            Posted by: {postData && postData.data.author_name}
                                        </li>
                                        <li className="inline mr-3 text-xs tracking-wide text-grey-text">
                                            Posted to: <Link to={`/room/${subPageName}`} className="link-card">{subPageName}</Link>
                                        </li>
                                        {
                                            currentUser?.uid === postData?.data?.author_uuid && (
                                                <>
                                                    {
                                                        postData?.data?.deleted !== true && <li onClick={handleDeletePost} className="inline mr-3 text-xs tracking-wide text-link-green cursor-pointer hover:text-link-hover">Delete</li>
                                                    }
                                                </>
                                            ) 
                                        }
                                    </ul>
                                    <div>
                                        {
                                            deletePostError && deletePostError !== "" && <>{deletePostError}</>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            currentUser && idToken ? (
                                <>
                                    <NewComment commentDataRefech={commentDataRefech} subpageUid={subpageUid} postId={postId} subPageName={subPageName} />
                                </>
                            ) : (
                                <>

                                </>
                            )
                        }
                    </>
                )
            }

            {
                commentDataLoading && commentDataLoading === true ? (
                    <>
                        <LoadingSpinner key={"loadingspinner2"} />
                    </>
                ) : (
                    <>
                        {
                            latestCommentData && latestCommentData !== null && latestCommentData !== undefined ? (
                                <Comment isChild={false} commentDataRefech={commentDataRefech} key={latestCommentData.data} data={latestCommentData.data} />
                            ) : (
                                <>
                                </>
                            )
                        }

                        {
                            commentData && commentData.data !== undefined && Object.keys(commentData.data).map((key, index) => (
                                <Comment isChild={false} commentDataRefech={commentDataRefech} key={index} data={commentData.data[key]} />
                            ))
                        }

                        {
                            commentData && commentData.success === false ? <>No comments yet :(</> : ""
                        }
                    </>
                )
            }
        </>
    );
}

export default SubPagePost;