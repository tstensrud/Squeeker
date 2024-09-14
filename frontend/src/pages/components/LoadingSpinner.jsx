function LoadingSpinner(props) {
    return (
        <div className="flex flex-row w-full h-full justify-center text-center items-center">
            <div className="border-4 border-[#121c26] rounded-[50%] border-t-accent-color w-5 h-5 animate-spin mr-3">
            </div>
            <div>
                Loading&nbsp;{props?.text}
            </div>
        </div>
    );
}

export default LoadingSpinner;