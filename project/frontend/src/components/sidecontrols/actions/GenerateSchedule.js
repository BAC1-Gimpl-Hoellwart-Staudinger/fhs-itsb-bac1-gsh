import ActionFormContainer from './ActionFormContainer';
import DropDownMUI from '../../inputs/DropDownMUI';
import ActionButton from './ActionButton';

function GenerateSchedule() {
    return (
        <ActionFormContainer>
            <DropDownMUI
                label="Select Dataset"
                menuItems={[]}
            />

            <ActionButton
                isLoading={false}
                type="button"
                variant={2}
            >
                Clear Schedules
            </ActionButton>

            <ActionButton
                isLoading={false}
                type="submit"
                variant={1}
            >
                Generate Schedule
            </ActionButton>
        </ActionFormContainer>
    );
}

export default GenerateSchedule;