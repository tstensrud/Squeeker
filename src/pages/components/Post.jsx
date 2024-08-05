function Post() {
    return (
        <>
            <div className="content-card">
                <div className="content-card-grid-item-header">
                    Post title
                </div>
                <div className="content-card-grid-item-score">
                    <div>+</div>
                    <div>pts</div>
                    <div>-</div>
                </div>
                <div className="content-card-grid-item-snippet">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quasi maiores voluptatum dolore animi quia perferendis, doloribus quae nisi dolorem consequatur. Deserunt vero tempora maxime necessitatibus temporibus ullam ipsam harum explicabo! <br />
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint natus alias blanditiis, sapiente sequi, laboriosam voluptates dolorem eius ipsa cum voluptas optio veritatis similique quaerat provident quod in tempore. Voluptatem... <br />

                </div>
                <div className="content-card-grid-item-sub-footer">
                    <ul className="horizontal-list">
                        <li className="horizontal-list-item">
                            timestamp
                        </li>
                        <li className="horizontal-list-item">
                            author
                        </li>
                        <li className="horizontal-list-item">
                            subpage
                        </li>
                    </ul>
                </div>
                <div className="content-card-grid-item-footer">
                    <ul className="horizontal-list">

                    
                    <li className="horizontal-list-item">
                        Comments
                    </li>
                    <li className="horizontal-list-item">
                        Share
                    </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Post