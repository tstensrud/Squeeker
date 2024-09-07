function PostReplyShareDeleteButton(props) {
    return (
        <div onClick={props.clickFunction} className="text-sm cursor-pointer text-grey-text rounded-lg p-0 border-0 mr-2 hover:text-accent-color">
            {props.buttonText}
        </div>
    );
}

export default PostReplyShareDeleteButton;