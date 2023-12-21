import { motion } from "framer-motion";

interface IHappyNewYearComponent {
  name: string;
  status: boolean;
}

export default function HappyNewYearComponent({
  name,
  status,
}: IHappyNewYearComponent) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{ duration: 2 }}
      animate={{ opacity: status ? 1 : 0, display: status ? "block" : "none" }}
    >
      <div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl uppercase text-center text-warning">
          Happy New Year 2024
        </h1>
        <h2 className="text-xl md:text-2xl lg:text-3xl text-center mt-6">
          ขออวยพรให้คุณ <b className="text-red-400">{name}</b>{" "}
          มีแต่ความสุขตลอดทั้งปีนะครับ
        </h2>
      </div>
    </motion.div>
  );
}
