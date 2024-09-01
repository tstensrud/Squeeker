import { Link } from "react-router-dom";

// widgets
import LoadingSpinner from "../components/LoadingSpinner.jsx";

function UserUpvotes({ upvoteData, upvoteDataLoading }) {
    return (
        <>
            {
                upvoteDataLoading && upvoteDataLoading === true ? (
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
                                            <div key={`${index}-${upvoteData.data[key]}`} className="card mb-3">
                                                <div className="flex mr-2">
                                                    <Link className="text-primary-color hover:text-accent-color" to={`/room/${upvoteData.data[key].subpage_name}/post/${upvoteData.data[key].uid}`}>
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
                                <div className="flex w-full bg-secondary-color rounded-md p-3">
                                    {upvoteData && upvoteData.message}
                                </div>
                            )
                        }
                    </>
                )
            }
        </>
    );
}

export default UserUpvotes;