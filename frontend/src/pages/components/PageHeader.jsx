function PageHeader(props) {
    return (
        <div className="flex flex-col w-full mb-5 mt-5">
            <div className="mb-2">
                <h2>{props.headerText}</h2>
            </div>
            <div className="text-base">
                {props.subheaderText}
            </div>
        </div>
    );
}

export default PageHeader