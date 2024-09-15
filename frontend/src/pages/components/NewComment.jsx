import { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';

import useSubmit from '../../hooks/useSubmit';

function NewComment({ commentDataRefech, postId, subpageUid, subPageName }) {

    const { currentUser, idToken } = useContext(AuthContext);
    const [comment, setComment] = useState("");
    const [commentWarning, setCommentWarning] = useState("");
    const {response, loading, error, submitData} = useSubmit(`api/subpage/comment/new/`);

    useEffect(() => {
        if (response !== null && response !== undefined) {
            if (response?.success !== false) {
                commentDataRefech();
            }
            commentRef.current.value = "";
        }
    }, [response]);

    // Handlers
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.comment || comment.comment === "") {
            setCommentWarning("Comments can not be empty");
            return;
        }
        await submitData(comment);
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
                <textarea ref={commentRef} onChange={handleInputChange} name="comment" className="bg-secondary-color border border-border-color outline-none p-2 w-1/2 rounded-lg mb-3 hover:border-accent-color focus:border-accent-color h-40" placeholder="Write a comment"></textarea>
                <p>
                    <button className="pr-2 pl-2" type="submit">Comment</button>
                    {commentWarning}
                    {response?.success === false && response.message}
                    {error && error}
                    {response?.error && response.error}
                </p>
            </form>
        </div>
    );
}

export default NewComment;