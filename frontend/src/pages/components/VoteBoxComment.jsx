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
                                    <ArrowUpvoted />
                                ) : (
                                    <Link onClick={handleUpvote} className="upvote-arrow" to="">
                                        <ArrowUp />
                                    </Link>
                                )
                            }
                        </>
                    ) : (
                        <>
                            <ArrowUp />
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
                                    <ArrowDownvoted />
                                ) : (
                                    <Link onClick={handleDownVote} className="upvote-arrow" to="">
                                        <ArrowDown />
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

export default VoteboxComment