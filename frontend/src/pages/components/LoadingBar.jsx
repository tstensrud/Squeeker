function LoadingBar() {
    return (
        <div className="w-full h-6 overflow-hidden relative">
            <div className="w-[30%] h-1/5 bg-accent-color absolute top-0 left-0 animate-slide"></div>
        </div>
    );
}

export default LoadingBar