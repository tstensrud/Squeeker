function Posts(props) {
    return (
        <>
            <div className="card">
                <div className="text-xl">
                    {props.title}
                </div>
                <div className="text-grey-text">
                    {props.post}
                </div>
                <div className="text-grey-text text-xs">
                    Posted to: {props.subpage_name} @ {props.timestamp}
                </div>
            </div>
        </>
    );
}

export default Posts