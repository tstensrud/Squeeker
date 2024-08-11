function HeaderComponent(props) {
    return (
        <>
            <div className="content-card-flex">
                <h2>Welcome to {props.title}!</h2>
                <p>
                    {props.description}
                </p>
            </div>
        </>
    );
}

export default HeaderComponent;