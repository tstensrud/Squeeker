import { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/globalVariables';

// Hooks
import usePatch from '../../hooks/usePatch';

function VoteboxComment({ deleted, totalCommentVotes, setTotalCommentVotes, voteStatus, postData }) {
    const { currentUser, idToken } = useContext(AuthContext);

    // useStates
    const [voteData, setVoteData] = useState();
    const [currenUpvoteStatus, setCurrentUpvoteStatus] = useState();
    const [currentDownvotestatus, setCurrentDownvoteStatus] = useState();

    // Fetches and patches
    const { data: upvoteData, error: upVoteError, updateData: upvote } = usePatch(`api/subpage/post/vote/${postData}/1/`);
    const { data: downvoteData, error: downvoteError, updateData: downvote } = usePatch(`api/subpage/post/vote/${postData}/-1/`);
    const { data: resetVote, error: resetVoteError, updateData: resetVoteData } = usePatch(`api/subpage/post/vote/${postData}/0/`);

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
    }, [voteStatus]);

    // Handlers
    const handleUpvote = async (e) => {
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
                                    <Link className={deleted === true ? 'cursor-auto' : 'cursor-pointer'} onClick={deleted !== true && handleResetVote} >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-accent-color">
                                            <line x1="12" y1="20" x2="12" y2="4"></line>
                                            <polyline points="6 10 12 4 18 10"></polyline>
                                        </svg>
                                    </Link>
                                ) : (
                                    <Link className={deleted === true ? 'cursor-auto' : 'cursor-pointer'} onClick={deleted !== true && handleUpvote}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-navbar-link hover:stroke-accent-color">
                                            <line x1="12" y1="20" x2="12" y2="4"></line>
                                            <polyline points="6 10 12 4 18 10"></polyline>
                                        </svg>
                                    </Link>
                                )
                            }
                        </>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-navbar-link hover:stroke-accent-color">
                            <line x1="12" y1="20" x2="12" y2="4"></line>
                            <polyline points="6 10 12 4 18 10"></polyline>
                        </svg>
                    )
                }
            </div>

            <div>
                {
                    currentUser && idToken ? (
                        <>
                            {
                                currentDownvotestatus === true ? (
                                    <Link className={deleted === true ? 'cursor-auto' : 'cursor-pointer'} onClick={deleted !== true && handleResetVote}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-accent-color">
                                            <line x1="12" y1="4" x2="12" y2="20"></line>
                                            <polyline points="18 14 12 20 6 14"></polyline>
                                        </svg>
                                    </Link>
                                ) : (
                                    <Link className={deleted === true ? 'cursor-auto' : 'cursor-pointer'} onClick={deleted !== true && handleDownVote}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-navbar-link hover:stroke-accent-color">
                                            <line x1="12" y1="4" x2="12" y2="20"></line>
                                            <polyline points="18 14 12 20 6 14"></polyline>
                                        </svg>
                                    </Link>
                                )
                            }
                        </>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-navbar-link hover:stroke-accent-color">
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