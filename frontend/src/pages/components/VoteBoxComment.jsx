import { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

// Hooks
import usePatch from '../../hooks/usePatch';
import useFetch from '../../hooks/useFetch';
import { BASE_URL } from '../../utils/globalVariables';
import { AuthContext } from '../../context/AuthContext';

// SVG import
import ArrowUp from '../../assets/svg/ArrowUp.svg?react';
import ArrowUpvoted from '../../assets/svg/ArrowUpvoted.svg?react';
import ArrowDown from '../../assets/svg/ArrowDown.svg?react';
import ArrowDownvoted from '../../assets/svg/ArrowDownvoted.svg?react';

function VoteboxComment({ postData, refetch }) {
    const { currentUser, idToken } = useContext(AuthContext);
    const [voteData, setVoteData] = useState();

    // Fetches and patches
    const { data: upvoteData, error: upVoteError, updateData: upvote } = usePatch(`${BASE_URL}/api/subpage/post/vote/${postData}/up/`, idToken)
    const { data: downvoteData, error: downvoteError, updateData: downvote } = usePatch(`${BASE_URL}/api/subpage/post/vote/${postData}/down/`, idToken)
    const { data: hasUpvoted, refetch: refetchHasUpvoted } = useFetch(
        currentUser ? `${BASE_URL}/api/subpage/comment/has_upvoted/${currentUser.uid}/${postData}/` : null, idToken);

    // useEffects
    useEffect(() => {
        setVoteData({
            post: false,
            voter: currentUser && currentUser.uid,
        });
    }, []);

    useEffect(() => {
        if (upvoteData && upvoteData.success === true || downvoteData && downvoteData.success === true) {
            refetch();
            refetchHasUpvoted();
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
                                    <Link onClick={handleUpvote}  to="">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-header-link hover:stroke-link-green">
                                            <line x1="12" y1="20" x2="12" y2="4"></line>
                                            <polyline points="6 10 12 4 18 10"></polyline>
                                        </svg>
                                    </Link>
                                )
                            }
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-header-link hover:stroke-link-green">
                                <line x1="12" y1="20" x2="12" y2="4"></line>
                                <polyline points="6 10 12 4 18 10"></polyline>
                            </svg>
                        </>
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
                                hasUpvoted && hasUpvoted.success === true && hasUpvoted.data === false ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-link-green">
                                        <line x1="12" y1="4" x2="12" y2="20"></line>
                                        <polyline points="18 14 12 20 6 14"></polyline>
                                    </svg>
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