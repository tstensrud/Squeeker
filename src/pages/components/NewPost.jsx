function NewPost() {
    return (
        <>
            <div className="content-card">
                <form>
                    <input type="text" placeholder="Post title" />
                    <textarea className="form-text-area" placeholder="Write something here.."></textarea>
                    <button>Post</button>
                </form>
            </div>
        </>
    );
}

export default NewPost;