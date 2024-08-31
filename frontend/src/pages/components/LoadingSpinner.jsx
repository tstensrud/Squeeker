function LoadingSpinner(props) {
    return (
        <>
            <div className="flex flex-row w-full h-full justify-center text-center items-center">
                <div className="loading-spinner mr-3">
                </div>
                <div>
                Loading&nbsp;{props?.text}
                </div>
            </div>
        </>
    );
}

export default LoadingSpinner;