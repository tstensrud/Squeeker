function PostReplyShareDeleteButton(props) {
    return (
        <button onClick={props.clickFunction} className="mr-3 bg-tertiary-color text-sm text-grey-text rounded-lg p-0 border-0 hover:text-accent-color">
            {props.buttonText}
        </button>
    );
}

export default PostReplyShareDeleteButton;