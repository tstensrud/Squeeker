
//Components
import Comments from "./Comments.jsx";

// Widgets
import LoadingSpinner from "../components/LoadingSpinner.jsx";

function UserComments({commentDataLoading, commentData}) {
    return (
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
                                <div className="flex w-full bg-secondary-color rounded-md p-3">
                                    {commentData && commentData.message}
                                </div>
                            )}
                    </>
                )
            }
        </>
    );
}

export default UserComments;