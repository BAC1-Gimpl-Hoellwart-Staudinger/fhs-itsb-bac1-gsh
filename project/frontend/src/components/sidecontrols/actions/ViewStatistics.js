import ActionFormContainer from './ActionFormContainer';
import ActionButton from './ActionButton';
import useModal from '../../../hooks/useModal';

function ViewStatistics() {
    const { showModal, setShowModal, Modal } = useModal();

    function handleSubmit(event) {
        event.preventDefault();
        setShowModal(true);
    }

    return (
        <ActionFormContainer
            onSubmit={handleSubmit}
        >
            <Modal
                label="View Statistics"
                showModal={showModal}
                setShowModal={setShowModal}
            >
                <h2>The statistics are based on the currently displaying calendar schedule</h2>
                <h1>Mjoa, do is nu nix ge</h1>
            </Modal>

            <ActionButton
                type="submit"
                variant={3}
            >
                View Statistics
            </ActionButton>
        </ActionFormContainer>
    );
}

export default ViewStatistics;