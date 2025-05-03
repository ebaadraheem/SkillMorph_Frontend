import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ScrollTop } from "../Custom/Components";
export const LandingPage = () => {
  const navigate = useNavigate();

  const texts = [
    "Expertly curated courses",
    "Interactive Platform",
    "Vibrant community",
  ];
  return (
    <motion.div
      className=" bg-[#F9FAFB] text-[#111827] flex mb-10 flex-col items-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <main className="flex flex-col  justify-center  min-h-screen items-center pt-10 pb-2  text-center">
        <h2 className="text-4xl max-sm:m-3 font-bold">
          Your Gateway to <span className="text-[#3B82F6]">Smarter</span>{" "}
          Learning
        </h2>
        <p className="mt-4 max-w-xl max-sm:p-2">
          Enhance your education journey with our interactive platform, offering
          expertly curated courses and a vibrant community
          to support your growth.
        </p>

        <div className="mt-6 mx-2 max-sm:mb-3 flex flex-wrap justify-center gap-4">
          {texts.map((text, index) => (
            <div
              key={index}
              className="bg-[#E5E7EB] text-[#111827] px-4 py-2 rounded shadow"
            >
              {text}
            </div>
          ))}
        </div>

        <div className="mt-10 max-xs:m-2 bg-[#111827] rounded-lg p-6 flex flex-col items-center gap-4 text-white ">
          <div className=" mx-4  xs:mx-6 flexer rounded-lg">
            <img
              src="Owner.jpg"
              alt="Owner"
              className="rounded-full md:w-[300px] md:h-[300px] w-[250px] h-[250px]  object-cover "
            />
          </div>
          <div>
            <p className="font-semibold ">Ebaad Raheem</p>
            <p className="text-sm text-gray-400">Platform Owner</p>
            {/* <p className="mt-2 text-gray-400 text-sm">
              <span className="font-bold">-200</span> people have joined already
            </p> */}
            <div className="flex items-center gap-4">
              <a
                href="mailto:ebaadraheem20@gmail.com"
                className="mt-4 bg-[#EF4444] text-white px-6 py-2 rounded-lg hover:bg-[#DC2626] hover:scale-105 transition-all inline-block text-center"
              >
                Email Me
              </a>

              <button
                onClick={() => {
                  ScrollTop();
                  navigate("/home")
                }}
                className="mt-4 bg-[#EF4444] text-white px-6 py-2 rounded-lg hover:bg-[#DC2626] hover:scale-105 transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
};
