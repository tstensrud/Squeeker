import { Outlet, Link } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { GlobalContext } from "../../context/GlobalContext.jsx";

// Hooks ++
import useFetch from '../../hooks/useFetch.jsx';
import useFetchDemand from '../../hooks/useFetchDemand.jsx';
import { BASE_URL } from '../../utils/globalVariables.jsx';

// widgets
import LoadingBar from '../components/LoadingBar.jsx';
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import Posts from "./Posts.jsx";
import Comments from "./Comments.jsx";

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
        currentUser ? `${BASE_URL}/user/${currentUser.uid}/` : null,
        idToken
    );
    const { data: postData, loading: postDataLoading, error: postDataError } = useFetch(
        currentUser ? `${BASE_URL}/user/posts/${currentUser.uid}/` : null,
        idToken
    );
    const { data: scoreData, loading: scoreDataLoading, error: scoreDataError } = useFetch(
        currentUser ? `${BASE_URL}/user/stats/${currentUser.uid}/` : null,
        idToken
    );

    // Other fetches
    const { data: commentData, loading: commentDataLoading, error: commentDataError, fetchData: fetchCommentData } = useFetchDemand(
        currentUser ? `${BASE_URL}/user/comments/${currentUser.uid}/` : null, idToken);
    const { data: upvoteData, loading: upvoteDataLoading, error: upvoteDataError, fetchData: fetchUpvoteData } = useFetchDemand(`${BASE_URL}/user/upvoted/posts/${currentUser.uid}/`, idToken);
    const { data: downVoteData, loading: downVoteDataLoading, error: downVoteDataError, fetchData: fetchDownVoteData } = useFetchDemand(`${BASE_URL}/user/downvoted/posts/${currentUser.uid}/`, idToken);
    

    const navbarItems = [
        { text: "Posts", hasFetched: null, setFetched: null, fetch: null },
        { text: "Comments", hasFetched: hasFetchedCommentData, setFetched: setHasFetchedCommentData, fetch: fetchCommentData },
        { text: "Upvotes", hasFetched: hasFetchedUpvoteData, setFetched: setHasFetchedUpvoteData, fetch: fetchUpvoteData },
        { text: "Downvotes", hasFetched: hasFetchedDownvoteData, setFetched: setHasFetchedDownvoteData, fetch: fetchDownVoteData }
    ]

    useEffect(() => {
        setSelectedIndex(props.index);
    },[]);
    
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
                        <div className="flex bg-card-bg-color rounded-lg w-80 p-5 h-20 justify-center items-center">
                            You are not logged in.
                        </div>
                    </div>
                ) : (
                    <>
                        {
                            userData && userData.success === true ? (
                                <>
                                    <div className="flex flex-row w-80 mt-5">

                                        {/* Card user data and stats */}
                                        <div className="flex flex-col w-full">
                                            <h3>{userData && userData.data.username}</h3>

                                            <div className="card">
                                                <h4>Your user statistics</h4>
                                                <div className="flex flex-row w-full">
                                                    <div>
                                                        Post score:
                                                    </div>
                                                    <div className="ml-3 text-end flex-1">
                                                        {scoreData && scoreData.data.posts} pts.
                                                    </div>
                                                </div>
                                                <div className="flex flex-row">
                                                    <div>
                                                        Comment score:
                                                    </div>
                                                    <div className="ml-3 text-end flex-1">
                                                        {scoreData && scoreData.data.comments} pts.
                                                    </div>
                                                </div>
                                                <div className="flex flex-row">
                                                    <div>
                                                        Total posts:
                                                    </div>
                                                    <div className="ml-3 text-end flex-1">
                                                        {scoreData && scoreData.data.total_posts} posts
                                                    </div>
                                                </div>
                                                <div className="flex flex-row">
                                                    <div>
                                                        Total comments:
                                                    </div>
                                                    <div className="ml-3 text-end flex-1">
                                                        {scoreData && scoreData.data.total_comments} comments
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row w-full mt-6">
                                        {
                                            navbarItems.map((item, index) => (
                                                <div key={index} className="mr-3">
                                                    <div onClick={() => handleNavbarClick(index)} className={activeNavIndex === index ? "border cursor-pointer pl-3 pr-3 pt-1 pb-1 rounded-md border-link-green mb-2 text-center" : "border cursor-pointer pl-3 pr-3 pt-1 pb-1 rounded-md border-border-color mb-2 text-center hover:border-link-green"}>{item.text}</div>
                                                </div>
                                            ))
                                        }
                                    </div>

                                    <div className="flex flex-col w-full">

                                        { /* All userposts */}
                                        {
                                            activeNavIndex === 0 ? (
                                                <>
                                                    {
                                                        postDataLoading && postDataLoading === true ? (
                                                            <div className="card">
                                                                <LoadingBar />
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {
                                                                    postData && postData.success === true ? (
                                                                        <>
                                                                            {
                                                                                postData && Object.keys(postData.data).map((key) => (
                                                                                    <Posts key={postData.data[key].uid} postData={postData.data[key]} />
                                                                                ))
                                                                            }
                                                                        </>
                                                                    ) : (
                                                                        <div className="flex w-full bg-card-bg-color rounded-md p-3">
                                                                            {postData && postData.message}
                                                                        </div>
                                                                    )}
                                                            </>
                                                        )
                                                    }
                                                </>
                                            ) : (<></>)
                                        }


                                        { /* All user comments */}
                                        {
                                            activeNavIndex === 1 ? (
                                                <>
                                                    {
                                                        commentDataLoading && commentDataLoading === true ? (
                                                            <LoadingSpinner />
                                                        ) : (
                                                            <>
                                                                {
                                                                    commentData && commentData.success === true ? (
                                                                        <>
                                                                            {
                                                                                commentData && Object.keys(commentData.data).map((key, index) => (
                                                                                    <Comments key={commentData.data[key].uid} data={commentData.data[key]} />
                                                                                ))
                                                                            }
                                                                        </>
                                                                    ) : (
                                                                        <div className="flex w-full bg-card-bg-color rounded-md p-3">
                                                                            {commentData && commentData.message}
                                                                        </div>
                                                                    )}
                                                            </>
                                                        )
                                                    }
                                                </>
                                            ) : (<></>)
                                        }

                                        {/* All upvoted posts */}
                                        {
                                            activeNavIndex === 2 ? (
                                                <>
                                                    {
                                                        upvoteData && upvoteData.loading === true ? (
                                                            <>
                                                                <LoadingSpinner />
                                                            </>
                                                        ) : (
                                                            <>
                                                                {
                                                                    upvoteData && upvoteData.success === true ? (
                                                                        <>
                                                                            {
                                                                                upvoteData.data && Object.keys(upvoteData.data).map((key, index) => (
                                                                                    <div key={`${index}-${upvoteData.data[key]}`} className="card">
                                                                                        <div className="flex mr-2">
                                                                                            <Link to={`/room/${upvoteData.data[key].subpage_name}/post/${upvoteData.data[key].uid}`}>
                                                                                                {upvoteData.data[key].post}
                                                                                            </Link>
                                                                                        </div>
                                                                                        <div className="flex flex-row text-grey-text text-xs flex-1">
                                                                                            <div className="mr-3">
                                                                                                Posted to: {upvoteData.data[key].subpage_name}
                                                                                            </div>
                                                                                            <div>
                                                                                                Upvoted on {upvoteData.data[key].event_timestamp}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </>
                                                                    ) : (
                                                                        <div className="flex w-full bg-card-bg-color rounded-md p-3">
                                                                            {upvoteData && upvoteData.message}
                                                                        </div>
                                                                    )
                                                                }
                                                            </>
                                                        )
                                                    }
                                                </>
                                            ) : (<></>)
                                        }

                                        {/* All downvoted posts */}
                                        {
                                            activeNavIndex === 3 ? (
                                                <>
                                                    {
                                                        downVoteData && downVoteData.loading === true ? (
                                                            <>
                                                                <LoadingSpinner />
                                                            </>
                                                        ) : (
                                                            <>
                                                                {
                                                                    downVoteData && downVoteData.success === true ? (
                                                                        <>
                                                                            {
                                                                                downVoteData.data && Object.keys(downVoteData.data).map((key, index) => (
                                                                                    <div key={`${index}-${downVoteData.data[key]}`} className="card">
                                                                                        <div className="flex mr-2">
                                                                                            <Link to={`/room/${downVoteData.data[key].subpage_name}/post/${downVoteData.data[key].uid}`}>
                                                                                                {downVoteData.data[key].post}
                                                                                            </Link>
                                                                                        </div>
                                                                                        <div className="flex flex-row text-grey-text text-xs flex-1">
                                                                                            <div className="mr-3">
                                                                                                Posted to: {downVoteData.data[key].subpage_name}
                                                                                            </div>
                                                                                            <div>
                                                                                                Downvoted on {downVoteData.data[key].event_timestamp}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            {downVoteData && downVoteData.message}
                                                                        </>
                                                                    )
                                                                }
                                                            </>
                                                        )
                                                    }

                                                </>
                                            ) : (<></>)
                                        }
                                    </div>
                                </>
                            ) : (
                                <div className="flex w-full bg-card-bg-color rounded-md p-3">
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