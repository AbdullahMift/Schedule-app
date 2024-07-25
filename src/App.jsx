import { useEffect } from "react";
import { useState } from "react";

import WorkImg from "../public/images/Group1.png";
import Pause from "../public/images/Group2.png";
import Skylab from "../public/images/Skylab.png";

// 08:00 - 9:30
// 10:00 - 11:30
// 12:00 - 13:30
// 14:00 - 15:30
// 16:00 - 17:30
// 18:00 - 19:30
// 20:00 - 21:30
// 22:00 - 23:30
// 00:00 - 01:30

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [schedule, setSchedule] = useState("rest");

  const currHour = currentTime.getHours();
  const currMinutes = currentTime.getMinutes();
  const currSeconds = currentTime.getSeconds();

  let [currentDataTime, setCurrentDataTime] = useState([
    { start: [0, 0], end: [0, 0] },
    0,
  ]);

  const data = [
    { start: [8, 0], end: [9, 30] },
    { start: [10, 0], end: [11, 30] },
    { start: [12, 0], end: [13, 30] },
    { start: [14, 0], end: [15, 30] },
    { start: [16, 0], end: [17, 30] },
    { start: [18, 0], end: [19, 30] },
    { start: [20, 0], end: [21, 30] },
    { start: [22, 0], end: [23, 30] },
    { start: [0, 0], end: [1, 30] },
    { start: [2, 0], end: [3, 30] },
  ];

  const checkSchedule = () => {
    let isWorkTime = false;

    for (let index = 0; index < data.length; index++) {
      const start = data[index].start;
      const end = data[index].end;

      if (
        currHour == start[0] ||
        (currHour == end[0] && currMinutes <= end[1])
      ) {
        setCurrentDataTime([data[index], index]);
        console.log("date", currentDataTime);
      } else if (
        currHour == start[0] ||
        (currHour == end[0] && currMinutes >= end[1])
      ) {
        setCurrentDataTime([data[index + 1], index]);
      }

      if (
        (currHour > start[0] ||
          (currHour === start[0] && currMinutes >= start[1])) &&
        (currHour < end[0] || (currHour === end[0] && currMinutes <= end[1]))
      ) {
        isWorkTime = true;
        break;
      }
    }

    if (isWorkTime) {
      setSchedule("work");
    } else {
      setSchedule("rest");
    }
  };

  const getTimeLeft = () => {
    if (currentDataTime.length === 0) return "00:00";

    const end = currentDataTime[0].end;
    const endMinutes = end[0] * 60 + end[1];
    const currMinutesTotal = currHour * 60 + currMinutes;

    let timeLeft = endMinutes - currMinutesTotal;
    if (timeLeft < 0) timeLeft += 24 * 60; // If the end time is on the next day

    const hoursLeft = Math.floor(timeLeft / 60);
    const minutesLeft = timeLeft % 60;

    return `0${hoursLeft}:${minutesLeft < 10 ? "0" : ""}${minutesLeft}`;
  };

  useEffect(() => {
    getTimeLeft();
  }, [1000]);

  useEffect(() => {
    checkSchedule();
    const intervalId = setInterval(() => {
      // setCurrentTime(new Date());
      getTimeLeft();
    }, [60000]);

    const currentTimeDisplay = setInterval(() => {
      setCurrentTime(new Date());
    }, [1000]);

    return () => clearInterval(intervalId);
  }, []);

  console.log("schedule: ", schedule);
  return (
    <>
      <div className="h-screen w-full bg-slate-100 flex items-center  flex-col gap-10 font-['Inter']">
        <div className="flex flex-row items-center gap-4">
          <img src={Skylab} className="h-20" />
          <p>
            {currHour}:{currMinutes}:{currSeconds}
          </p>
        </div>
        <div>
          <p>{/* {currHour}:{currMinutes}:{currSeconds} */}</p>
        </div>
        <div
          className={`relative w-[480px] mt-[50px] h-[90px] ${
            schedule === "work" ? "bg-[#279EFF]" : "bg-[#74E291]"
          }  flex justify-center items-center rounded-2xl`}
        >
          <img
            // { schedule  === "work" ? src={WorkImg} : src={Pause} }
            src={schedule == "work" ? WorkImg : Pause}
            alt=""
            className="left-0 pl-8 absolute h-[50px] "
          />
          <p className="text-[48px]  font-extrabold text-white">
            {/* {schedule} */}
            {/* {currentDataTime[0].end[0] - currHour}:
            {currentDataTime[0].end[1] - currMinutes} */}

            {getTimeLeft()}
          </p>
        </div>
        <div className="flex items-center flex-col gap-2">
          <div>
            <p>
              {schedule === "work" ? "pushimi fillon në" : "puna fillon ne"}
            </p>
          </div>
          <div
            className={`h-[45px] w-[220px] ${
              schedule === "work" ? "bg-[#74E291]" : "bg-[#279EFF]"
            }  rounded-xl flex relative justify-center items-center`}
          >
            <img
              src={schedule == "work" ? Pause : WorkImg}
              className="absolute left-0 pl-4 h-6"
              alt=""
            />
            <p className="text-white text-[24px] font-extrabold">
              {currentDataTime[0].end[0]}:{currentDataTime[0].end[1]}
            </p>
          </div>
          <div className="border-b-2 h-6 w-[600px] border-[lightgray]"></div>
          <div className="pt-4 flex items-center flex-col">
            {data.map((time, index) => {
              console.log("index", index);
              console.log("currr", currentDataTime);
              if (index > currentDataTime[1]) {
                return (
                  <div className="pt-1" key={index}>
                    <div>
                      <p>
                        {time.start[0]}:{time.start[1]}0 - {time.end[0]}:
                        {time.end[1]}
                      </p>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
