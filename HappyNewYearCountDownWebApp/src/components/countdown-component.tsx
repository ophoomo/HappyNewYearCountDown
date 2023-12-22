import { motion } from "framer-motion";
import moment from "moment-timezone";
import { useEffect, useState } from "react";

interface ICountDownComponent {
  status: boolean;
  callback: () => void;
}

export default function CountDownComponent({
  callback,
  status,
}: ICountDownComponent) {
  interface IDate {
    day: number;
    hour: number;
    min: number;
    sec: number;
  }

  const [date, setDate] = useState<IDate>({
    day: 0,
    hour: 0,
    min: 0,
    sec: 0,
  });

  const countdown = () => {
    const now = moment().tz("Asia/Bangkok");
    const end = moment([2024, 0, 1]).tz("Asia/Bangkok");
    const diffTime = end.diff(now);
    const duration = moment.duration(diffTime, "milliseconds");
    const new_date = {
      day: parseInt(duration.asDays().toFixed(0)),
      hour: duration.hours(),
      min: duration.minutes(),
      sec: duration.seconds(),
    };
    setDate(new_date);
    if (check_date(new_date)) {
      callback();
    }
  };

  const check_date = (date: IDate) => {
    if (date.day <= 0 && date.hour <= 0 && date.min <= 0 && date.sec <= 0)
      return true;
    return false;
  };

  useEffect(() => {
    countdown();
    setInterval(() => {
      countdown();
    }, 1000);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{ duration: 2 }}
      animate={{ opacity: status ? 1 : 0, display: status ? "block" : "none" }}
    >
      <div>
        <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
          <div className="flex flex-col text-yellow-600">
            <span className="countdown font-mono text-5xl md:text-7xl lg:text-8xl text-yellow-500">
              <span
                style={
                  // @ts-ignore
                  { "--value": date.day }
                }
              ></span>
            </span>
            days
          </div>
          <div className="flex flex-col text-yellow-600">
            <span className="countdown font-mono text-5xl md:text-7xl lg:text-8xl text-yellow-500">
              <span
                style={
                  // @ts-ignore
                  { "--value": date.hour }
                }
              ></span>
            </span>
            hours
          </div>
          <div className="flex flex-col text-yellow-600">
            <span className="countdown font-mono text-5xl md:text-7xl lg:text-8xl text-yellow-500">
              <span
                style={
                  // @ts-ignore
                  { "--value": date.min }
                }
              ></span>
            </span>
            min
          </div>
          <div className="flex flex-col text-yellow-600">
            <span className="countdown font-mono text-5xl md:text-7xl lg:text-8xl text-yellow-500">
              <span
                style={
                  // @ts-ignore
                  { "--value": date.sec }
                }
              ></span>
            </span>
            sec
          </div>
        </div>
      </div>
    </motion.div>
  );
}
