import { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';
import { GlobalContext } from '../context/GlobalContext';
import useFetchRequest from '../hooks/useFetchRequest';
import useFetch from '../hooks/useFetch';
import { BASE_URL } from '../utils/globalVariables';

// Components
import NewComment from './components/NewComment';
import LoadingSpinner from './components/LoadingSpinner';
import LoadingBar from './components/LoadingBar';
import Comment from './components/Comment';
import Votebox from './components/VoteBox';
import useDelete from '../hooks/useDelete';

function SubPagePost(props) {

    const { subPageName, postId } = useParams();
    const { currentUser, idToken } = useContext(AuthContext);
    const { setSelectedIndex } = useContext(GlobalContext);


    // Initial fetches
    const { data: subpageData, loading: subpageDataLoading, error: subpageDataError } = useFetch(`api/subpage/${subPageName}/`);

    const { data: commentData, loading: commentDataLoading, error: commentDataError, refetch: commentDataRefech } = useFetch(
        postId ? `api/subpage/post/all_comments/${postId}/` : null);

    const { data: postData, loading: postDataLoading, error: postDataError, refetch: refetchPostData } = useFetch(
        postId ? `api/subpage/post/${postId}/` : null);

    // useStates
    const [subpageUid, setSubpageUid] = useState("");
    const [newCommentUid, setNewCommentUid] = useState(null);
    const [deletePostError, setDeleteError] = useState("");
    const [totalVotes, setTotalVotes] = useState();


    // To refetch the uers latest comment
    const { data: latestCommentData, loading: latestCommentLoading, error: latestCommentError, fetchData } = useFetchRequest(
        newCommentUid ? `api/subpage/get_comment/${newCommentUid}/` : null);

    // Delete post content
    const { response: deleteResponse, error: deleteError, setData, deleteEntry } = useDelete(`api/subpage/post/delete/${postId}/`);

    // useEffects
    useEffect(() => {
        setData({ author_uuid: postData?.data?.post_data?.author_uuid });
    }, [postData]);

    useEffect(() => {
        if (postData?.success === true) {
            setTotalVotes(postData?.data?.post_data?.total_votes);
        }
    }, [postData]);

    useEffect(() => {
        setSubpageUid(subpageData?.data?.post_data?.uid)
    }, [subpageData])

    useEffect(() => {
        setSelectedIndex(props.index);
    }, []);

    useEffect(() => {
        if (deleteResponse?.success === true) {
            refetchPostData();
        } else {
            setDeleteError(deleteResponse?.message);
        }
    }, [deleteResponse])

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
        await deleteEntry();
    }

    return (
        <>
            {
                postDataLoading && postDataLoading === true ? (
                    <LoadingBar />
                ) : (
                    <>
                        <div className="flex flex-row border border-tertiary-color rounded-lg mt-5 pt-3 pb-3 pr-3">
                            <div className="flex flex-col pt-1 w-12 justify-start items-center">
                                <Votebox totalVotes={totalVotes} setTotalVotes={setTotalVotes} voteStatus={postData?.data?.post_data?.has_upvoted} post={true} postData={postData?.data} />
                            </div>
                            <div className="flex flex-col">
                                <div className="text-xl">
                                    {postData?.data?.post_data?.title}
                                </div>
                                <div className="text-base text-post-content-color">
                                    {postData?.data?.post_data?.post}
                                </div>
                                <div>
                                    <ul className="p-0 m-0 list-none">
                                        <li className="sm:inline mr-3 text-xs tracking-wide text-grey-text">
                                            Last modified at: {postData?.data?.post_data?.event_timestamp}
                                        </li>
                                        <li className="sm:inline mr-3 text-xs tracking-wide text-grey-text">
                                            Posted by: {postData?.data?.post_data?.author_name}
                                        </li>
                                        <li className="sm:inline mr-3 text-xs tracking-wide text-grey-text">
                                            Posted to: <Link to={`/room/${subPageName}`} className="link-card">{subPageName}</Link>
                                        </li>
                                        {
                                            currentUser?.uid === postData?.data?.post_data?.author_uuid && (
                                                <>
                                                    {
                                                        postData?.data?.post_data?.deleted !== true && <li onClick={handleDeletePost} className="inline mr-3 text-xs tracking-wide text-accent-color cursor-pointer hover:text-primary-color">Delete</li>
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
                            currentUser && idToken && (
                                <NewComment commentDataRefech={commentDataRefech} subpageUid={subpageUid} postId={postId} subPageName={subPageName} />
                            )
                        }
                     
                        {
                            commentDataLoading && commentDataLoading === true ? (
                                <LoadingSpinner text="comments" />
                            ) : (
                                <>
                                    {
                                        latestCommentData && latestCommentData !== null && latestCommentData !== undefined && (
                                            <Comment isChild={false} key={latestCommentData.data} data={latestCommentData.data} />
                                        )
                                    }

                                    {
                                        commentData && commentData.data !== undefined && Object.keys(commentData.data).map((key, index) => (
                                            <div key={index} className="flex flex-col  w-full mt-5 mb-5 pt-3 pb-3 pl-2 pr-2">
                                                <Comment isChild={false} data={commentData.data[key]} />
                                            </div>
                                        ))
                                    }

                                    {
                                        commentData && commentData.success === false && <>No comments yet :(</>
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

export default SubPagePost;