import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

import { BASE_URL } from '../../utils/globalVariables';
import useSubpagePost from '../../hooks/useSubpagePost';
import { useNavigate } from 'react-router-dom';

function NewPost(props) {

    const { currentUser, idToken } = useContext(AuthContext);
    const [warningTitleMessage, setWarningTitleMessage] = useState("");
    const [warniningContentMessage, setWarningContentMessage] = useState("");
    const [postContent, setPostContent] = useState("");
    const subpageUid = props.subPageUid;
    const { loading, data, error, subpagePost } = useSubpagePost(`${BASE_URL}/api/subpage/${subpageUid}/new_post/`, idToken);
    const navigate = useNavigate();
    const subpageName = props.subPageName;

    const handleInputChange = (e) => {
        setPostContent({
            ...postContent,
            [e.target.id]: e.target.value,
        })
    }

    useEffect(() => {
        setPostContent({
            ...postContent,
            author: props.author.uid,
            subpageName: props.subPageName,
        });
    }, [])

    useEffect(() => {
        setPostContent((prevContent) => ({
            ...prevContent,
            subpageUid: subpageUid,
        }));
    }, [subpageUid]);

    useEffect(() => {
        if (data && data.success === true) {
            //props.refetchSubpageData();
            navigate(`/room/${subpageName}/post/${data.data.post_uid}/`)
        }
    }, [data])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (! postContent.title || postContent.title === "") {
            setWarningTitleMessage("This field can not be empty");
            return;
        } else if (postContent.title && postContent.title.length < 10) {
            setWarningTitleMessage("Title must be greater than 10 chars");
            return;
        } else if (!postContent.content || postContent.content === "") {
            setWarningContentMessage("This content of your post can not be empty");
            return;
        } else if (postContent.content && postContent.content.length < 10) {
            setWarningContentMessage("Your post is too short. Min 10 chars.");
            return;
        }
        await subpagePost(postContent);
        //navigate to the new post, with the uid receved from this method
    }
    
    return (
        <>
            <div className="card">
                <div className="w-full p-2 text-base">
                    <h3>Create new discussion topic</h3>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col rounded-lg mb-3 mt-3 p-2">
                        <div className="mb-4">
                            <input onChange={handleInputChange} className="mr-3" id="title" type="text" placeholder="Post title" /> {warningTitleMessage}
                        </div>
                        <div className="flex flex-col">
                            <textarea className="bg-app-bg-color border border-border-color outline-none p-2 h-40 w-96 rounded-lg mb-3 mr-3 hover:border-form-hover focus:border-form-focus" onChange={handleInputChange} id="content" placeholder="Write something here.."></textarea>
                            <span>{warniningContentMessage}</span>
                        </div>

                        <div>
                            <button className="standard-button mr-3" type="submit">Post</button>
                            {data && data.success === false ? <>{data.message}</> : ""}
                            {error && error}
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default NewPost;