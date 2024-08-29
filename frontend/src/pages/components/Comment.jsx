import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import useFetchDemand from '../../hooks/useFetchDemand';
import useSubpagePost from '../../hooks/useSubpagePost';
import useFetch from '../../hooks/useFetch';

import { BASE_URL } from '../../utils/globalVariables';
import { AuthContext } from '../../context/AuthContext';

// Components
import LoadingSpinner from './LoadingSpinner';
import VoteboxComment from './VoteBoxComment';
import PostReplyShareDeleteButton from "./formcomponents/PostReplyShareDeleteButton";
import useDelete from "../../hooks/useDelete";
import CollapseArrow from "./CollapseArrow";

function Comment({ isChild, data }) {
    const commentUid = data?.data.uid;
    const { currentUser, idToken } = useContext(AuthContext);

    // useStates
    const [showReplyContainer, setShowReplyContainer] = useState(false);
    const [reply, setReply] = useState({});
    const [replyWarning, setReplyWarning] = useState("");
    const [deleteData, setDeleteData] = useState({})
    const [totalCommentVotes, setTotalCommentVotes] = useState(data?.data?.total_votes);

    // Show this after user comments. Render directly in the component rather then refetching from server.
    const [showLatestReply, setShowLatestReply] = useState(false)

    // Fetch and posts
    const { loading, data: replyData, error: replyError, subpagePost } = useSubpagePost(`${BASE_URL}/api/subpage/comment/reply/new/`, idToken);
    const { response: deleteResponse, loading: deleteLoading, error: deleteError, deleteEntry } = useDelete(`${BASE_URL}/api/subpage/comment/delete/${commentUid}/`, idToken);

    useEffect(() => {
        setDeleteData({ author_uuid: currentUser?.uid });
    }, [data]);

    useEffect(() => {
        if (deleteResponse?.success === true) {
            //commentDataRefetch();
        }
    }, [deleteResponse]);

    useEffect(() => {
        setReply((prev) => ({
            ...prev,
            authorUid: currentUser?.uid,
            parentComment: data?.data?.uid,
            postUid: data?.data?.post_uid,
        }));
    }, [data]);

    // Close reply container if response from server is positive
    useEffect(() => {
        if (replyData && replyData.success === true) {
            setShowReplyContainer(!showReplyContainer);
        }
    }, [replyData]);

    // Handlers
    const toggleReplySection = (e) => {
        e.preventDefault();
        setShowReplyContainer(!showReplyContainer);
        setReplyWarning("");
    }

    const submitReply = async (e) => {
        e.preventDefault();
        if (!reply.comment || reply.comment === "") {
            setReplyWarning("Reply can not be empty");
            return;
        }
        await subpagePost(reply);
    }

    const handleReplyChange = (e) => {
        setReply((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    const handleDeleteComment = async (e) => {
        e.preventDefault();
        await deleteEntry(deleteData);
    }

    const handleCollapse = () => {
        console.log("collapse")
    }
    return (
        <>
            <div className="card mt-5">

                <div className="flex flex-row">
                    <div className="flex flex-col w-12">
                        <VoteboxComment totalCommentVotes={totalCommentVotes} setTotalCommentVotes={setTotalCommentVotes} voteStatus={data?.has_voted} postData={commentUid} />
                    </div>

                    <div className="flex flex-col flex-1 m-0">
                        {
                            isChild !== true ? (
                                <>
                                    <div className="text-xs text-grey-text">
                                        <strong>{totalCommentVotes}</strong> pts. Commented at: {data?.data?.timestamp} by: <Link to="#">{data?.data?.author_name}</Link>
                                    </div>
                                    <div className="mb-3 mt-3">
                                        {data?.data?.comment}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="text-xs text-grey-text">
                                        <strong>{totalCommentVotes}</strong> pts. Commented at: {data?.data?.timestamp} by: <Link to="#">{data?.data?.author_name}</Link>
                                    </div>
                                    <div className="mb-3 mt-3">
                                        {data?.data?.comment}
                                    </div>
                                </>
                            )
                        }

                        <div className="flex flex-row">
                            {
                                currentUser && idToken ? (
                                    <PostReplyShareDeleteButton clickFunction={toggleReplySection} buttonText="Leave reply" />
                                ) : (<></>)
                            }
                            <PostReplyShareDeleteButton /*clickFunction={}*/ buttonText="Share" />
                            {
                                currentUser?.uid === data?.data?.author_uuid && (
                                    <>
                                        {
                                            data?.data?.deleted !== true && <PostReplyShareDeleteButton clickFunction={handleDeleteComment} buttonText="Delete" />
                                        }

                                    </>
                                )
                            }
                        </div>

                        {
                            showReplyContainer === true ? (
                                <div className="flex p-3 flex-col bg-card-bg-color">
                                    <form onSubmit={submitReply} className="flex flex-col">
                                        <textarea name="comment" onChange={handleReplyChange} className="bg-app-bg-color border outline-none border-border-color text-base leading-5 p-1 h-20 w-96 mb-3 hover:border-link-green focus:border-link-green " placeholder="Leave a reply"></textarea>
                                        <span>
                                            <button className="mr-3 bg-card-bg-color text-grey-text rounded-lg p-0 border-0 hover:text-link-green">Reply</button>
                                            <button className="mr-3 bg-card-bg-color text-grey-text rounded-lg p-0 border-0 hover:text-link-green" onClick={toggleReplySection}>Cancel</button>
                                        </span>
                                        <span>{replyWarning}</span>
                                        <p>
                                            {replyData && replyData.success === false ? (replyData.message) : (<></>)}
                                        </p>
                                    </form>
                                </div>
                            ) : (<></>)
                        }

                        {
                            showLatestReply && (
                                <div className="flex mt-3 ml-3 p-1 rounded-bl-lg border-l border-b border-border-color">
                                    <div className="flex flex-row">
                                        <div className="flex flex-col w-12">
                                            <VoteboxComment />
                                        </div>
                                        <div className="flex flex-col flex-1 m-0">
                                            <div className="text-xs text-grey-text">
                                                <strong>asdf</strong> pts. Commented at:  by: <Link to="#">name</Link>
                                            </div>
                                            <div className="mb-3 mt-3">
                                                comment
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }


                    </div>
                    {
                        !data?.data?.parent_comment_uid && (
                            <CollapseArrow clickFunction={handleCollapse} />
                        )
                    }
                </div>
                {
                    data?.children && Object.keys(data?.children).map((key, index) => (
                        <div key={`${index}+${data?.children[key]}`} className="flex mt-3 ml-3 p-1 rounded-bl-lg border-l border-b border-border-color">
                            <CollapseArrow clickFunction={handleCollapse} />
                            <Comment isChild={true} data={data?.children[key]} key={index} />
                        </div>
                    ))
                }
            </div>
        </>
    );
}

export default Comment;