
// Components
import Posts from "./Posts.jsx";

// widgets
import LoadingSpinner from "../components/LoadingSpinner.jsx";

function UserPosts({postDataLoading, postData}) {
    return (
        <>
            {
                postDataLoading && postDataLoading === true ? (
                    <div className="card">
                        <LoadingSpinner />
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
                                <div className="flex w-full bg-secondary-color rounded-md p-3">
                                    {postData && postData.message}
                                </div>
                            )}
                    </>
                )
            }
        </>
    );
}

export default UserPosts