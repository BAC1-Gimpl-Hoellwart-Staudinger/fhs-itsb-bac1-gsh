import { useContext, useState, useEffect } from "react";
import { SideControlsContext } from "../../../contexts/SideControlsContext";
import { CalendarContext } from "../../../contexts/CalendarContext";
import { useAsyncFn } from "../../../hooks/useAsync";
import { getSchedule, getStats } from "../../../utils/ApiRequest";
import ReactJson from "react-json-view";
import ActionFormContainer from "./ActionFormContainer";
import DropDownMUI from "../../inputs/DropDownMUI";
import ActionButton from "./ActionButton";
import useModal from "../../../hooks/useModal";
import toast from "react-hot-toast";
import Appointment from "../../../utils/Appointment";

function GenerateSchedule() {
    const {
        LOCAL_STORAGE_DATASETS_KEY,
        datasetSize,
        setStats
    } = useContext(SideControlsContext);
    const { setAppointments } = useContext(CalendarContext);
    const { isLoading, execute: getScheduleExecute } = useAsyncFn(getSchedule);
    const { isLoadingStats, execute: getStatsExecute } = useAsyncFn(getStats);
    const { showModal, setShowModal, Modal } = useModal();
    const [menuItemsDataset, setMenuItemsDataset] = useState([]);
    const [dropDownDatasetValue, setDropDownDatasetValue] = useState(
        menuItemsDataset.length > 0 ? menuItemsDataset[menuItemsDataset.length - 1].value : ""
    );
    const [selectedDataset, setSelectedDataset] = useState(null);
    const [dropDownAlgorithmVersionValue, setDropDownAlgorithmVersionValue] = useState(1);
    
    const menuItemsAlgorithmVersion = [
        {
            label: "Version 1",
            value: 1,
        },
        {
            label: "Version 2",
            value: 2,
        },
    ];

    function getSelectedDataset() {
        const localStorageDatasetItems = window.localStorage.getItem(LOCAL_STORAGE_DATASETS_KEY);
        const datasets = JSON.parse(localStorageDatasetItems);
        const dataset = datasets[dropDownDatasetValue];
        dataset.metadata.algorithm_version = dropDownAlgorithmVersionValue;
        return dataset;
    }

    function handleClickViewDataset() {
        if (dropDownDatasetValue === "" || datasetSize === 0) return;
        setSelectedDataset(getSelectedDataset());
        setShowModal(true);
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (dropDownDatasetValue === "" || datasetSize === 0) return;

        getScheduleExecute(getSelectedDataset())
            .then((schedule) => {
                const appointments = Appointment.APIDatasetToAppointments(schedule);
                setAppointments(appointments);

                toast.success("Successfully displayed schedule", { duration: 3000 });

                getStatsExecute(schedule)
                    .then((stats) => {
                        setStats(stats);
                        toast.success("Successfully calculated stats", { duration: 3000 });
                    })
                    .catch((err) => toast.error(err));
            }).catch((err) => toast.error(err));
    }

    useEffect(() => {
        const localStorageDatasetItems = window.localStorage.getItem(LOCAL_STORAGE_DATASETS_KEY);

        if (!localStorageDatasetItems || localStorageDatasetItems.length === 0) return;

        const datasets = JSON.parse(localStorageDatasetItems);
        const menuItems = datasets.map((dataset, datasetIndex) => ({
            label: `dataset-${dataset["metadata"]["created_at_date"]
            .replaceAll(" ", "-")
            .replaceAll(":", "")}`,
            value: datasetIndex,
        }));
        setMenuItemsDataset(menuItems);
        setDropDownDatasetValue(menuItems[menuItems.length - 1].value);
    }, [LOCAL_STORAGE_DATASETS_KEY, datasetSize]);

    return (
        <ActionFormContainer
            onSubmit={handleSubmit}
        >
            <Modal
                label="View Dataset"
                showModal={showModal}
                setShowModal={setShowModal}
            >
                {selectedDataset && (
                    <ReactJson
                        src={selectedDataset}
                        displayDataTypes={false}
                        enableEdit={false}
                        enableAdd={false}
                        enableDelete={false}
                    />
                )}
            </Modal>

            <DropDownMUI
                label="Select Dataset"
                value={dropDownDatasetValue}
                setValue={setDropDownDatasetValue}
                menuItems={menuItemsDataset}
            />

            <DropDownMUI
                label="Select Algorithm Version"
                value={dropDownAlgorithmVersionValue}
                setValue={setDropDownAlgorithmVersionValue}
                menuItems={menuItemsAlgorithmVersion}
            />

            <ActionButton
                type="button"
                variant={0}
                onClick={handleClickViewDataset}
            >
                View Dataset
            </ActionButton>

            <ActionButton
                isLoading={isLoading || isLoadingStats}
                type="submit"
                variant={1}
            >
                Generate Schedule
            </ActionButton>
        </ActionFormContainer>
    );
}

export default GenerateSchedule;
