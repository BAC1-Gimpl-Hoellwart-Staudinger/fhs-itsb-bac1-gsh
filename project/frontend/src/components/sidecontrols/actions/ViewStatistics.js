import { useContext } from "react";
import { SideControlsContext } from "../../../contexts/SideControlsContext";
import { PiWarningDuotone } from "react-icons/pi";
import { IoMdInformationCircleOutline } from "react-icons/io";
import ActionFormContainer from "./ActionFormContainer";
import ActionButton from "./ActionButton";
import useModal from "../../../hooks/useModal";
import Plot from "react-plotly.js";

function getColorForIndex(index) {
  const colors = [
    "rgb(37, 99, 235)",
    "rgb(22, 163, 74)",
    "rgb(202, 138, 4)",
    "rgb(220, 38, 38)",
    "rgb(79, 70, 229)",
    "rgb(147, 51, 234)",
    "rgb(219, 39, 119)",
  ];
  return colors[index % colors.length];

}

function getColorForIndexHoliday(index) {
  const colors = [
    "rgb(97, 120, 235)",
    "rgb(82, 200, 74)",
    "rgb(232, 198, 40)",
    "rgb(220, 88, 88)",
    "rgb(79, 70, 160)",
    "rgb(200, 51, 234)",
    "rgb(219, 89, 119)",
  ];
  return colors[index % colors.length];
}

function ViewStatistics() {
  const { showModal, setShowModal, Modal } = useModal();
  const { stats, convertExecTimeToSeconds } = useContext(SideControlsContext);

  function handleSubmit(event) {
    event.preventDefault();
    setShowModal(true);
  }

  function displayStats() {
    if (!stats) {
      return (
        <div className="h-full flex flex-col gap-3 items-center justify-center">
          <PiWarningDuotone size={52} />
          <h2 className="text-2xl">
            No statistics available, generate a schedule first.
          </h2>
        </div>
      );
    } else {
      const scheduleLength = stats.stats.total_days;
      const employeeCount = stats.stats.total_employees;
      const employees = stats.metadata.employees;
      const perEmployeeStats = stats.stats.per_employee;
      const algorithmVersion = stats.metadata.algorithm_version;
      const execTime = convertExecTimeToSeconds(stats.metadata.algorithm_execution_time_ms);

      return (
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-center gap-2 my-1">
            <IoMdInformationCircleOutline size={18} />
            <p className="text-gray-700 text-center">
              The statistics are based on the currently displaying schedule in the calendar
            </p>
          </div>
          <div className="overflow-x-auto">
            <p className="text-lg">
              The schedule consists of{" "}
              <span className="font-semibold">{scheduleLength}</span> days
              and was generated with algorithm version{" "}
              <span className="font-semibold">
                {algorithmVersion}
              </span>
            </p>
            <p className="text-lg">
              Additionally,{" "}
              <span className="font-semibold">{employeeCount}</span> employees were considered within a runtime of <span className="font-semibold">{execTime}</span> s:
            </p>

            <table className="border-collapse border table-auto mt-4 w-full">
              <thead className="border text-center bg-gray-100">
                <tr>
                  <th className="py-3">Name</th>
                  <th className="py-3">Total days worked</th>
                  <th className="py-3">Week days worked</th>
                  <th className="py-3">Weekend days / Holidays worked</th>
                </tr>
              </thead>
              <tbody className="border text-center">
                {employees.map((employee, index) => (
                  <tr key={index} className="border text-center">
                    <td className="py-3">{employee.name}</td>
                    <td className="py-3">
                      {
                        perEmployeeStats.filter(
                          (empl) => empl.id === employee.id
                        )[0].sum_days
                      }
                    </td>
                    <td className="py-3">
                      {
                        perEmployeeStats.filter(
                          (empl) => empl.id === employee.id
                        )[0].work_days
                      }
                    </td>
                    <td className="py-3">
                      {
                        perEmployeeStats.filter(
                          (empl) => empl.id === employee.id
                        )[0].weekend_holiday_days
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }

  function drawACFs() {
    if (!stats) return;

    const empl = stats.stats.per_employee;
    const employees = stats.metadata.employees;
    var data = [];
    empl.forEach((e) => {
      const acf = e.acf;
      const half_acf = acf.slice(Math.floor(acf.length / 2));
      data.push({
        y: half_acf.slice(0, 20),
        type: "bar",
        marker: {
          color: getColorForIndex(e.id - 1),
        },
        name: employees.filter((empl) => empl.id === e.id)[0].name,
      });
    });

    const layout = {
      width: "1000",
      barmode: "group",
      title: "Autocorrelation Function",
    };

    return (
      <div className="flex justify-center">
        <Plot data={data} layout={layout} />
      </div>
    );
  }

  function drawWeekdayStats() {
    if (!stats) return;

    const empl = stats.stats.per_employee;
    const employees = stats.metadata.employees;
    var data = [];
    empl.forEach((e, i) => {
      const non_holiday = e.weekdays_worked.non_holiday;
      data.push({
        x: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        y: non_holiday,
        offsetgroup: i,
        type: "bar",
        marker: {
          color: getColorForIndex(e.id - 1),
        },
        name: `${
          employees.filter((empl) => empl.id === e.id)[0].name
        } (non-holiday)`,
      });
    });

    empl.forEach((e, i) => {
      const holidays = e.weekdays_worked.holidays;
      const non_holiday = e.weekdays_worked.non_holiday;
      data.push({
        x: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        y: holidays,
        offsetgroup: i,
        base: non_holiday,
        type: "bar",
        marker: {
          color: getColorForIndexHoliday(e.id - 1),
        },
        name: `${
          employees.filter((empl) => empl.id === e.id)[0].name
        } (holiday)`,
      });
    });

    const layout = {
      width: "1000",
      barmode: "group",
      title: "Weekdays worked per employees",
    };

    return (
      <div className="flex justify-center">
        <Plot data={data} layout={layout} />
      </div>
    );
  }

  return (
    <ActionFormContainer onSubmit={handleSubmit}>
      <Modal
        label="View Statistics"
        showModal={showModal}
        setShowModal={setShowModal}
      >
        {displayStats()}
        {drawACFs()}
        {drawWeekdayStats()}
      </Modal>

      <ActionButton type="submit" variant={3}>
        View Statistics
      </ActionButton>
    </ActionFormContainer>
  );
}

export default ViewStatistics;
