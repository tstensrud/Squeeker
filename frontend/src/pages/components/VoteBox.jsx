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

function Votebox({ post, postData }) {
    const { currentUser, idToken } = useContext(AuthContext);
    const [voteData, setVoteData] = useState();
    const postUid = postData.uid;
    
    // Fetches and patches
    const { data: upvoteData, error: upVoteError, updateData: upvote } = usePatch(`${BASE_URL}/api/subpage/post/vote/${postUid}/up/`, idToken);
    const { data: downvoteData, error: downvoteError, updateData: downvote } = usePatch(`${BASE_URL}/api/subpage/post/vote/${postUid}/down/`, idToken);
    const { data: totalVotes, refetch: refetchTotalVotes } = useFetch(`${BASE_URL}/api/subpage/post/votes/${postUid}/`, idToken);
    const { data: hasUpvoted, refetch: refetchHasUpvoted } = useFetch(
        currentUser ? `${BASE_URL}/api/subpage/post/has_upvoted/${currentUser.uid}/${postUid}/` : null, idToken);
    
    // useEffects
    useEffect(() => {
        setVoteData({
            post: post,
            voter: currentUser && currentUser.uid,
        });
    }, []);

    useEffect(() => {
        if (upvoteData && upvoteData.success === true || downvoteData && downvoteData.success === true) {
            refetchHasUpvoted();
            refetchTotalVotes();
        }
    }, [upvoteData, downvoteData]);

    // Handlers
    const handleUpvote = (e) => {
        e.preventDefault();
        upvote(voteData);
    }

    const handleDownVote = (e) => {
        e.preventDefault();
        downvote(voteData)
    }

    
    return (
        <>
            <div>
                {
                currentUser && idToken ? (
                    <>
                        {
                            hasUpvoted && hasUpvoted.success === true && hasUpvoted.data === true ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-link-green">
                                    <line x1="12" y1="20" x2="12" y2="4"></line>
                                    <polyline points="6 10 12 4 18 10"></polyline>
                                </svg>
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
            <div>
                {
                    post && post === true ? (
                        <>
                            { /* postData && postData.total_votes */ totalVotes && totalVotes.data }
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
                                hasUpvoted && hasUpvoted.success === true && hasUpvoted.data === false ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-link-green">
                                        <line x1="12" y1="4" x2="12" y2="20"></line>
                                        <polyline points="18 14 12 20 6 14"></polyline>
                                    </svg>
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