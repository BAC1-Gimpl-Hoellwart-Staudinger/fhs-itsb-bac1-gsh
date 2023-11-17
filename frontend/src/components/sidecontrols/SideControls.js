import { useState } from 'react';
import ViewScaleButtons from './ViewScaleButtons';
import ContentButton from './ContentButton';
import DateControls from './DateControls';
import GenerateDataset from './actions/GenerateDataset';
import GenerateSchedule from './actions/GenerateSchedule';
import ViewStatistics from './actions/ViewStatistics';

function SideControls() {
    const [isContentOpen, setIsContentOpen] = useState(false);

    return (
        <div className="h-auto md:h-full w-full bg-gray-50 py-5 px-8 flex flex-col gap-2">
            <div>
                <DateControls />

                <ViewScaleButtons />

                <ContentButton
                    isContentOpen={isContentOpen}
                    handleClick={() => setIsContentOpen((prevState) => !prevState)}
                />
            </div>
            
            {isContentOpen && (
                <div className="md:h-full md:w-full flex flex-col md:justify-between py-3 gap-5 md:gap-0">
                    <GenerateDataset />

                    <GenerateSchedule />

                    <ViewStatistics />
                </div>
            )}
        </div>
    );
}

export default SideControls;