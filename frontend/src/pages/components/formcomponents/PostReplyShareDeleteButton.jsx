function PostReplyShareDeleteButton(props) {
    return (
        <>
            <button onClick={props.clickFunction} className="mr-3 bg-card-bg-color text-sm text-grey-text rounded-lg p-0 border-0 hover:text-link-green">{props.buttonText}</button>
        </>
    );
}

export default PostReplyShareDeleteButton;