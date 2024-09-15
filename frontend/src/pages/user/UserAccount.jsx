import { Outlet, Link } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { GlobalContext } from "../../context/GlobalContext.jsx";

// Hooks ++
import useFetch from '../../hooks/useFetch.jsx';
import useFetchRequest from '../../hooks/useFetchRequest.jsx';

// widgets
import UserScoreStats from "./UserScoreStats.jsx";
import UserPosts from "./UserPosts.jsx";
import UserComments from "./UserComments.jsx";
import UserUpvotes from "./UserUpvotes.jsx";
import UserDownvotes from "./UserDownvotes.jsx";

function UserAccount(props) {

    const { currentUser, idToken } = useContext(AuthContext);
    const { setSelectedIndex } = useContext(GlobalContext);

    // States
    const [hasFetchedCommentData, setHasFetchedCommentData] = useState(false);
    const [hasFetchedUpvoteData, setHasFetchedUpvoteData] = useState(false);
    const [hasFetchedDownvoteData, setHasFetchedDownvoteData] = useState(false);

    // Navbar index
    const [activeNavIndex, setActiveNavIndex] = useState(0);

    // Initial fetch
    const { data: userData, loading: userDataLoading, error: userDataError } = useFetch(
        currentUser ? `user/${currentUser.uid}/` : null);
    const { data: postData, loading: postDataLoading, error: postDataError } = useFetch(
        currentUser ? `user/posts/${currentUser.uid}/` : null);
    const { data: scoreData, loading: scoreDataLoading, error: scoreDataError } = useFetch(
        currentUser ? `user/stats/${currentUser.uid}/` : null);

    // Other fetches
    const { data: commentData, loading: commentDataLoading, error: commentDataError, fetchData: fetchCommentData } = useFetchRequest(
        currentUser ? `user/comments/${currentUser.uid}/` : null);
    const { data: upvoteData, loading: upvoteDataLoading, error: upvoteDataError, fetchData: fetchUpvoteData } = useFetchRequest(
        currentUser ? `user/upvoted/posts/${currentUser.uid}/`: null);
    const { data: downVoteData, loading: downVoteDataLoading, error: downVoteDataError, fetchData: fetchDownVoteData } = useFetchRequest(
        currentUser ? `user/downvoted/posts/${currentUser.uid}/` : null);


    const navbarItems = [
        { text: "Your posts", hasFetched: null, setFetched: null, fetch: null },
        { text: "Your comments", hasFetched: hasFetchedCommentData, setFetched: setHasFetchedCommentData, fetch: fetchCommentData },
        { text: "Posts you upvoted", hasFetched: hasFetchedUpvoteData, setFetched: setHasFetchedUpvoteData, fetch: fetchUpvoteData },
        { text: "Posts you downvoted", hasFetched: hasFetchedDownvoteData, setFetched: setHasFetchedDownvoteData, fetch: fetchDownVoteData }
    ]

    useEffect(() => {
        setSelectedIndex(props.index);
    }, []);

    // Handlers
    const handleNavbarClick = (index) => {
        if (navbarItems[index].hasFetched !== null && navbarItems[index].setFetched !== null && navbarItems[index].fetch !== null) {
            if (!navbarItems[index].hasFetched) {
                navbarItems[index].fetch();
                navbarItems[index].setFetched(true);
            }
        }
        setActiveNavIndex(index);
    }

    return (
        <>
            {
                !currentUser && !idToken ? (
                    <div className="flex w-full h-full justify-center items-center">
                        <div className="flex bg-secondary-color rounded-lg w-80 p-5 h-20 justify-center items-center">
                            You are not logged in.
                        </div>
                    </div>
                ) : (
                    <>
                        {
                            userData && userData.success === true ? (
                                <>
                                    <div className="flex flex-row w-80 mt-5">
                                        <UserScoreStats userDataLoading={userDataLoading} username={userData?.data.username} posts={scoreData?.data.posts} comments={scoreData?.data.comments} total_posts={scoreData?.data.total_posts} total_comments={scoreData?.data.total_comments} />
                                    </div>

                                    <div className="flex flex-row w-full mt-6">
                                        {
                                            navbarItems.map((item, index) => (
                                                <div key={index} className="mr-3">
                                                    <div onClick={() => handleNavbarClick(index)} className={activeNavIndex === index ? "border cursor-pointer pl-3 pr-3 pt-1 pb-1 rounded-md border-accent-color mb-2 text-center" : "border cursor-pointer pl-3 pr-3 pt-1 pb-1 rounded-md border-secondary-color mb-2 text-center hover:border-accent-color"}>{item.text}</div>
                                                </div>
                                            ))
                                        }
                                    </div>



                                    <div className="flex flex-col w-full">
                                        {
                                            activeNavIndex === 0 && <UserPosts postDataLoading={postDataLoading} postData={postData && postData} />
                                        }

                                        {
                                            activeNavIndex === 1 && <UserComments commentDataLoading={commentDataLoading && commentDataLoading} commentData={commentData && commentData} />
                                        }

                                        {
                                            activeNavIndex === 2 && <UserUpvotes upvoteDataLoading={upvoteDataLoading && upvoteDataLoading} upvoteData={upvoteData && upvoteData} />
                                        }

                                        {
                                            activeNavIndex === 3 && <UserDownvotes downVoteDataLoading={downVoteDataLoading && downVoteDataLoading} downVoteData={downVoteData && downVoteData} />
                                        }
                                    </div>
                                </>
                            ) : (
                                <div className="flex w-full bg-secondary-color rounded-md p-3">
                                    {userData && userData.message}
                                </div>
                            )
                        }
                    </>
                )
            }
        </>
    );
}

export default UserAccount;