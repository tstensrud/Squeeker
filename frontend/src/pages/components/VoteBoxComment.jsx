import { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/globalVariables';

// Hooks
import usePatch from '../../hooks/usePatch';

function VoteboxComment({ totalCommentVotes, setTotalCommentVotes, voteStatus, postData }) {
    const { currentUser, idToken } = useContext(AuthContext);
    
    // useStates
    const [voteData, setVoteData] = useState();
    const [currenUpvoteStatus, setCurrentUpvoteStatus] = useState();
    const [currentDownvotestatus, setCurrentDownvoteStatus] = useState();

    // Fetches and patches
    const { data: upvoteData, error: upVoteError, updateData: upvote } = usePatch(`${BASE_URL}/api/subpage/post/vote/${postData}/1/`, idToken);
    const { data: downvoteData, error: downvoteError, updateData: downvote } = usePatch(`${BASE_URL}/api/subpage/post/vote/${postData}/-1/`, idToken);
    const { data: resetVote, error: resetVoteError, updateData: resetVoteData } = usePatch(`${BASE_URL}/api/subpage/post/vote/${postData}/0/`, idToken);

    // useEffects
    useEffect(() => {
        setVoteData({
            post: false,
            voter: currentUser?.uid,
        });
    }, []);

    useEffect(() => {
        setCurrentUpvoteStatus(voteStatus?.upvoted);
        setCurrentDownvoteStatus(voteStatus?.downvoted);
    },[voteStatus]);

    // Handlers
    const handleUpvote = async (e) => {
        console.log("Upvote")
        e.preventDefault();
        if (currentDownvotestatus === true) {
            setTotalCommentVotes(totalCommentVotes + 2);
        } else {
            setTotalCommentVotes(totalCommentVotes + 1);
        }
        setCurrentUpvoteStatus(true);
        setCurrentDownvoteStatus(false);
        await upvote(voteData);
    }

    const handleDownVote = async (e) => {
        console.log("Downvote")
        e.preventDefault();
        if (currenUpvoteStatus === true) {
            setTotalCommentVotes(totalCommentVotes - 2);
        } else {
            setTotalCommentVotes(totalCommentVotes - 1);
        }
        setCurrentUpvoteStatus(false);
        setCurrentDownvoteStatus(true);
        await downvote(voteData);
    }

    const handleResetVote = async (e) => {
        console.log("Reset")
        e.preventDefault();
        setCurrentUpvoteStatus(false);
        setCurrentDownvoteStatus(false);
        if (currenUpvoteStatus === true) {
            setTotalCommentVotes(totalCommentVotes - 1);
        } else if (currentDownvotestatus === true) {
            setTotalCommentVotes(totalCommentVotes + 1);
        }
        await resetVoteData(voteData);
    }

    return (
        <>
            <div>
                {
                    currentUser && idToken ? (
                        <>
                            {
                                currenUpvoteStatus === true ? (
                                    <Link onClick={handleResetVote} >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-link-green">
                                            <line x1="12" y1="20" x2="12" y2="4"></line>
                                            <polyline points="6 10 12 4 18 10"></polyline>
                                        </svg>
                                    </Link>
                                ) : (
                                    <Link onClick={handleUpvote}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-header-link hover:stroke-link-green">
                                            <line x1="12" y1="20" x2="12" y2="4"></line>
                                            <polyline points="6 10 12 4 18 10"></polyline>
                                        </svg>
                                    </Link>
                                )
                            }
                        </>
                    ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-header-link hover:stroke-link-green">
                                <line x1="12" y1="20" x2="12" y2="4"></line>
                                <polyline points="6 10 12 4 18 10"></polyline>
                            </svg>
                    )
                }


            </div>
            <div>

            </div>
            <div>
                {
                    currentUser && idToken ? (
                        <>
                            {
                                currentDownvotestatus === true ? (
                                    <Link onClick={handleResetVote}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-link-green">
                                            <line x1="12" y1="4" x2="12" y2="20"></line>
                                            <polyline points="18 14 12 20 6 14"></polyline>
                                        </svg>
                                    </Link>
                                ) : (
                                    <Link onClick={handleDownVote} to="">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-header-link hover:stroke-link-green">
                                            <line x1="12" y1="4" x2="12" y2="20"></line>
                                            <polyline points="18 14 12 20 6 14"></polyline>
                                        </svg>
                                    </Link>
                                )
                            }
                        </>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-header-link hover:stroke-link-green">
                            <line x1="12" y1="4" x2="12" y2="20"></line>
                            <polyline points="18 14 12 20 6 14"></polyline>
                        </svg>
                    )
                }
            </div>
        </>
    );
}

export default VoteboxComment