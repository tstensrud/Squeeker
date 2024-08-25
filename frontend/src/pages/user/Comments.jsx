

function Comments(props) {
    return (
        <>
            <div className="flex flex-col mb-3 w-full p-3 bg-card-bg-color rounded-lg">
                <div className="text-xs">
                    @ {props.timestamp} to {props.subpage_name}
                </div>
                <div className="text-grey-text">
                    {props.comment}
                </div>
                <div className="text-grey-text text-xs font-bold">
                    {props.total_votes} pts.
                </div>
            </div>
        </>
    );
}

export default Comments;