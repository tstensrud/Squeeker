import { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';
import useFetchDemand from '../hooks/useFetchDemand';
import useFetch from '../hooks/useFetch';
import { BASE_URL } from '../utils/globalVariables';

// Components
import NewComment from './components/NewComment';
import LoadingSpinner from './components/LoadingSpinner';
import Comment from './components/Comment';
import Votebox from './components/VoteBox';

// SVG import
import ArrowUp from '../assets/svg/ArrowUp.svg?react';
import ArrowDown from '../assets/svg/ArrowDown.svg?react';

function SubPagePost() {

    const { subPageName, postId } = useParams();
    const { currentUser, idToken } = useContext(AuthContext);
    const [subpageUid, setSubpageUid] = useState("");
    const [newCommentUid, setNewCommentUid] = useState(null);

    // Initial fetches
    const { data: subpageData, loading: subpageDataLoading, error: subpageDataError } = useFetch(`${BASE_URL}/api/subpage/${subPageName}/`, idToken);
    const { data: commentData, loading: commentDataLoading, error: commentDataError, refetch: commentDataRefech } = useFetch(`${BASE_URL}/api/subpage/post/${postId}/comments/`, idToken);
    const { data: postData, loading: postDataLoading, error: postDataError } = useFetch(
        postId ? `${BASE_URL}/api/subpage/post/${postId}/` : null, idToken);

    // To refetch the uers latest comment
    const { data: latestCommentData, loading: latestCommentLoading, error: latestCommentError, fetchData } = useFetchDemand(
        newCommentUid ? `${BASE_URL}/api/subpage/get_comment/${newCommentUid}/` : null, idToken);

    useEffect(() => {
        setSubpageUid(subpageData && subpageData.data.uid)
    }, [subpageData])

    const handleChildMsg = (msg) => {
        if (msg.msg === "fetch_latest_comment") {
            setNewCommentUid(msg.uid);
        }
    }

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

    return (
        <>
            {
                postDataLoading && postDataLoading === true ? (<LoadingSpinner key={"loadingspinner1"} />
                ) : (
                    <>
                        <div className="subpage-post-header-container">
                            <div className="subpage-post-header-pts">
                                <Votebox post={true} postData={postData && postData.data} />
                            </div>
                            <div style={{display: "flex", flexDirection: "column"}}>
                                <div className="subpage-post-header-post-title">
                                    {postData && postData.data.title}
                                </div>
                                <div className="subpage-post-header-post-content">
                                    {postData && postData.data.post}
                                </div>
                                <div>
                                <ul className="horizontal-list">
                                    <li className="horizontal-list-item">
                                        <span className="grey-info-text">Submitted at: {postData && postData.data.timestamp}</span>
                                    </li>
                                    <li className="horizontal-list-item">
                                        <span className="grey-info-text">Posted by: {postData && postData.data.author_name}</span>
                                    </li>
                                    <li className="horizontal-list-item">
                                        <span className="grey-info-text">Posted to: <Link to={`/room/${subPageName}`} className="link-card">{subPageName}</Link></span>
                                    </li>
                                </ul>
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
                                <Comment msgToParent={handleChildMsg} key={latestCommentData.data.uid} data={latestCommentData.data} />
                            ) : (
                                <>
                                </>
                            )
                        }

                        {
                            commentData && commentData.data !== undefined && Object.keys(commentData.data).map((key, index) => (
                                <Comment msgToParent={handleChildMsg} key={index} data={commentData.data[key]} />
                            ))
                        }
                        {
                            commentData && commentData.success === false ? <>No comments yet</> : ""
                        }
                    </>
                )
            }
        </>
    );
}

export default SubPagePost;