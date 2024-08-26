import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

import { BASE_URL } from '../../utils/globalVariables';
import useSubpagePost from '../../hooks/useSubpagePost';
import { useNavigate } from 'react-router-dom';

function NewPost(props) {

    const { currentUser, idToken } = useContext(AuthContext);
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
                            <input className="h-10 w-80 bg-app-bg-color p-3 text-header-link-hover rounded-lg border text-sm border-border-color focus:border-form-focus outline-none hover:border-form-hover" onChange={handleInputChange} id="title" type="text" placeholder="Post title" />
                        </div>
                        <div>
                            <textarea className="bg-app-bg-color border border-border-color outline-none p-2 h-40 w-96 rounded-lg mb-3 hover:border-form-hover focus:border-form-focus" onChange={handleInputChange} id="content" placeholder="Write something here.."></textarea>
                        </div>

                        <div>
                            <button className="bg-app-bg-color cursor-pointer border rounded-lg border-border-color p-1 h-10 w-24 text-grey-text hover:border-link-green transition:all 0.3 ease-in" type="submit">Post</button>
                        </div>
                    </div>
                </form>
            </div>
            <p>
                {error && error}
            </p>
        </>
    );
}

export default NewPost;