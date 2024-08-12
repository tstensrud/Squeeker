function HeaderComponent({subpageData}) {
    
    return (
        <>
            <div className="content-card-flex">
                <h2>Welcome to {subpageData && subpageData.name}!</h2>
                <p>
                    {subpageData && subpageData.description}
                </p>
            </div>
        </>
    );
}

export default HeaderComponent;