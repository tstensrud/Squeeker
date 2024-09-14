function Card(props) {
    return (
        <div className="rounded-lg bg-tertiary-color w-full flex flex-col p-3">
        {props.children}
        </div>
    );
}

export default Card