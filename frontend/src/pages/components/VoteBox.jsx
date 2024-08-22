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

function Votebox({ refetch, post, postData }) {
    const { currentUser, idToken } = useContext(AuthContext);
    const [voteData, setVoteData] = useState();
    const postUid = postData.uid;

    // Fetches and patches
    const { data: upvoteData, error: upVoteError, updateData: upvote } = usePatch(`${BASE_URL}/api/subpage/post/vote/${postUid}/up/`, idToken)
    const { data: downvoteData, error: downvoteError, updateData: downvote } = usePatch(`${BASE_URL}/api/subpage/post/vote/${postUid}/down/`, idToken)
    const { data: hasUpvoted, refetch: refetchHasUpvoted } = useFetch(`${BASE_URL}/api/subpage/post/has_upvoted/${currentUser.uid}/${postUid}/`, idToken);

    // useEffects
    useEffect(() => {
        setVoteData({
            post: post,
            voter: currentUser.uid,
        });
    }, []);

    useEffect(() => {
        if (upvoteData && upvoteData.success === true || downvoteData && downvoteData.success === true) {
            refetch();
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
    console.log(downvoteData);
    return (
        <>
            <div>

                {
                    hasUpvoted && hasUpvoted.success === true && hasUpvoted.data === true ? (
                        <ArrowUpvoted />
                    ) : (
                        <Link onClick={handleUpvote} className="upvote-arrow" to="">
                            <ArrowUp />
                        </Link>
                    )
                }
            </div>
            <div>
                {
                    post && post === true ? (
                        <>
                            {postData && postData.total_votes}
                        </>
                    ) : (
                        <>
                        </>
                    )
                }

            </div>
            <div>
                {
                    hasUpvoted && hasUpvoted.success === true && hasUpvoted.data === false ? (
                        <ArrowDownvoted />
                    ) : (
                        <Link onClick={handleDownVote} className="upvote-arrow" to="">
                            <ArrowDown />
                        </Link>
                    )
                }

            </div>
        </>
    );
}

export default Votebox