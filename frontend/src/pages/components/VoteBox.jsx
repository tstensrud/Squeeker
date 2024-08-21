import { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

// Hooks
import usePatch from '../../hooks/usePatch';
import { BASE_URL } from '../../utils/globalVariables';
import { AuthContext } from '../../context/AuthContext';

// SVG import
import ArrowUp from '../../assets/svg/ArrowUp.svg?react';
import ArrowDown from '../../assets/svg/ArrowDown.svg?react';

function Votebox({ post, postData }) {
    const { currentUser, idToken } = useContext(AuthContext);
    const [voteData, setVoteData] = useState();

    // Fetches and patches
    const {data: upvoteData, error: upVoteError, updateData: upvote } = usePatch(`${BASE_URL}/api/subpage/post/vote/${postData.uid}/up/`, idToken)
    const {data: downvoteData, error: downvoteError, updateData: downvote } = usePatch(`${BASE_URL}/api/subpage/post/vote/${postData.uid}/down/`, idToken)


    // useEffects
    useEffect(() => {
        setVoteData({
            post: post,
            voter: postData.author_uuid,
        });

    }, []);

    // Handlers
    const handleUpvote = (e) => {
        e.preventDefault();
        upvote(voteData);
    }

    const handleDownVote = (e) => {
        e.preventDefault();
        downvote(voteData)
    }

    console.log(upvoteData)
    console.log(downvoteData)
    return (
        <>
            <div>
                <Link onClick={handleUpvote} className="upvote-arrow" to="">
                    <ArrowUp />
                </Link>
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
                <Link onClick={handleDownVote} className="upvote-arrow" to="">
                    <ArrowDown />
                </Link>
            </div>
        </>
    );
}

export default Votebox