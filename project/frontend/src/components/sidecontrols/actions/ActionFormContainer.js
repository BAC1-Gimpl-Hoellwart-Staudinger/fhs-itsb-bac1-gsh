function ActionFormContainer(props) {
    const { children, onSubmit } = props;

    return (
        <form 
            className="bg-white shadow-lg rounded-md p-6 flex flex-col gap-4"
            onSubmit={onSubmit}
        >
            {children}
        </form>
    );
}

export default ActionFormContainer;