import { Link } from "react-router-dom";

// widgets
import LoadingSpinner from "../components/LoadingSpinner.jsx";

function UserDownvotes({ downVoteData, downVoteDataLoading }) {
    return (
        <>
            {
                downVoteDataLoading && downVoteDataLoading === true ? (
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
                                            <div key={`${index}-${downVoteData.data[key]}`} className="card mb-3">
                                                <div className="flex mr-2">
                                                    <Link className="text-primary-color hover:text-accent-color" to={`/room/${downVoteData.data[key].subpage_name}/post/${downVoteData.data[key].uid}`}>
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
    );
}

export default UserDownvotes;