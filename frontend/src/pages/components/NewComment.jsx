import { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';

import { BASE_URL } from '../../utils/globalVariables';
import useSubpagePost from '../../hooks/useSubpagePost';

function NewComment({ commentDataRefech, postId, subpageUid, subPageName, msgToParent }) {

    const { currentUser, idToken } = useContext(AuthContext);
    const [comment, setComment] = useState("");
    const [commentWarning, setCommentWarning] = useState("");
    const { loading, data, error, subpagePost } = useSubpagePost(`${BASE_URL}/api/subpage/comment/new/`, idToken);

    useEffect(() => {
        if (data !== null && data !== undefined) {
            if (data.success !== false) {
                commentDataRefech();
            }
            commentRef.current.value = "";
        }
    }, [data]);

    // Handlers
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.comment || comment.comment === "") {
            setCommentWarning("Comments can not be empty");
            return;
        }
        await subpagePost(comment);
        //console.log(comment);
    }

    const handleInputChange = (e) => {
        setComment({
            ...comment,
            [e.target.name]: e.target.value,
        })
    }

    useEffect(() => {
        if (currentUser) {
            setComment({
                author: currentUser.uid,
                postId: postId,
                subpageUid: subpageUid,
                subPageName: subPageName,
            });
        }
    }, []);

    // Textarea ref
    const commentRef = useRef(null);

    return (
        <div className="flex flex-col bg-tertiary-color rounded-lg mt-5 p-3">
            <span>
                <h2 className="text-xl mt-2 mb-2">Leave a comment</h2>
            </span>
            <form onSubmit={handleSubmit}>
                <textarea ref={commentRef} onChange={handleInputChange} name="comment" className="bg-secondary-color border border-border-color outline-none p-2 w-80 rounded-lg mb-3 hover:border-accent-color focus:border-accent-color focus:h-40 focus:w-1/2" placeholder="Write a comment"></textarea>
                <p>
                    <button className="standard-button" type="submit">Comment</button>
                    {commentWarning}
                    {data?.success === false && data.message}
                    {error && error}
                    {data?.error && data.error}
                </p>
            </form>
        </div>
    );
}

export default NewComment;