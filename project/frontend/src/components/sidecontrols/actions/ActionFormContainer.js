function ActionFormContainer(props) {
    const { children, handleSubmit } = props;

    return (
        <form 
            className="bg-white shadow-lg rounded-md p-6 flex flex-col gap-4"
            onSubmit={handleSubmit}
        >
            {children}
        </form>
    );
}

export default ActionFormContainer;