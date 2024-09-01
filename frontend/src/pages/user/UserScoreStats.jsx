import LoadingSpinner from "../components/LoadingSpinner";

function UserScoreStats({ userDataLoading, username, posts, comments, total_posts, total_comments }) {

    return (
        <div className="flex flex-col w-full">
            <h3>{username}</h3>
            <div className="card">
                <h4>Your user statistics</h4>
                {
                    userDataLoading === true ? (
                        <>
                            <div className="flex flex-row w-full h-8">
                                <div className="flex flex-1 justify-center items-center text-center">
                                    <LoadingSpinner />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex flex-row w-full">
                                <div className="text-grey-text">
                                    Post score:
                                </div>
                                <div className="ml-3 text-end flex-1">
                                    {posts} pts.
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <div className="text-grey-text">
                                    Comment score:
                                </div>
                                <div className="ml-3 text-end flex-1">
                                    {comments} pts.
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <div className="text-grey-text">
                                    Total posts:
                                </div>
                                <div className="ml-3 text-end flex-1">
                                    {total_posts} posts
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <div className="text-grey-text">
                                    Total comments:
                                </div>
                                <div className="ml-3 text-end flex-1">
                                    {total_comments} comments
                                </div>
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    );

}

export default UserScoreStats;

