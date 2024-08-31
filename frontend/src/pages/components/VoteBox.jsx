import { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

// Hooks
import usePatch from '../../hooks/usePatch';
import useFetch from '../../hooks/useFetch';
import { BASE_URL } from '../../utils/globalVariables';
import { AuthContext } from '../../context/AuthContext';

// SVG import
import ArrowUp from '../../assets/svg/ArrowUp.svg?react';
import ArrowDown from '../../assets/svg/ArrowDown.svg?react';

function Votebox({ totalVotes, voteStatus, setTotalVotes, post, postData }) {
    const { currentUser, idToken } = useContext(AuthContext);
    
    const [voteData, setVoteData] = useState();
    const [currenUpvoteStatus, setCurrentUpvoteStatus] = useState();
    const [currentDownvotestatus, setCurrentDownvoteStatus] = useState();

    // Fetches and patches
    const { data: upvoteData, error: upVoteError, updateData: upvote } = usePatch(`${BASE_URL}/api/subpage/post/vote/${postData.post_data.uid}/1/`, idToken);
    const { data: downvoteData, error: downvoteError, updateData: downvote } = usePatch(`${BASE_URL}/api/subpage/post/vote/${postData.post_data.uid}/-1/`, idToken);
    const { data: resetVote, error: resetVoteError, updateData: resetVoteData } = usePatch(`${BASE_URL}/api/subpage/post/vote/${postData.post_data.uid}/0/`, idToken);
    
    // useEffects
    useEffect(() => {
        setVoteData({
            post: post,
            voter: currentUser && currentUser.uid,
        });
    }, []);

    useEffect(() => {
        setCurrentUpvoteStatus(voteStatus?.upvoted);
        setCurrentDownvoteStatus(voteStatus?.downvoted);
    },[voteStatus]);


    // Handlers
    const handleUpvote = async (e) => {
        e.preventDefault();
        if (currentDownvotestatus === true) {
            setTotalVotes(totalVotes + 2);
        } else {
            setTotalVotes(totalVotes + 1);
        }
        setCurrentUpvoteStatus(true);
        setCurrentDownvoteStatus(false);
        await upvote(voteData);
    }

    const handleDownVote = async (e) => {
        e.preventDefault();
        if (currenUpvoteStatus === true) {
            setTotalVotes(totalVotes - 2);
        } else {
            setTotalVotes(totalVotes - 1);
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
            setTotalVotes(totalVotes - 1);
        } else if (currentDownvotestatus === true) {
            setTotalVotes(totalVotes + 1);
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
                                    <Link onClick={handleUpvote} className="upvote-arrowtext-link-green hover:underline">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-header-link hover:stroke-link-green">
                                            <line x1="12" y1="20" x2="12" y2="4"></line>
                                            <polyline points="6 10 12 4 18 10"></polyline>
                                        </svg>
                                    </Link>
                                )
                            }
                        </>
                    ) : (
                        <ArrowUp />
                    )
                }

            </div>
            <div className="flex min-w-14 items-center justify-center">
                {
                    post && post === true ? (
                        <>
                            {totalVotes}
                        </>
                    ) : (
                        <>
                        </>
                    )
                }

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
                                    <Link onClick={handleDownVote}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-header-link hover:stroke-link-green">
                                            <line x1="12" y1="4" x2="12" y2="20"></line>
                                            <polyline points="18 14 12 20 6 14"></polyline>
                                        </svg>
                                    </Link>
                                )
                            }
                        </>
                    ) : (
                        <ArrowDown />
                    )
                }


            </div>
        </>
    );
}

export default Votebox