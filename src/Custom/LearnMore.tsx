import React from "react";
import { motion } from "framer-motion";
interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  thumbnail?: string;
  price?: string;
  duration?: number;
  onClose: () => void;
}

const LearnMore: React.FC<Course> = ({
  title,
  description,
  instructor,
  thumbnail,
  price,
  duration,
  onClose,
}) => {
  const formatDuration = (duration: number) => {
    if (duration >= 3600) {
      const hours = Math.trunc(duration / 3600);
      const minutes = Math.trunc((duration % 3600) / 60);
      const seconds = Math.trunc(duration % 60);
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (duration >= 60) {
      const minutes = Math.trunc(duration / 60);
      const seconds = Math.trunc(duration % 60);
      return `${minutes}m ${seconds}s`;
    } else {
      return `${Math.trunc(duration)}s`; // Truncate duration for values less than 60.
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        className="bg-[#F9FAFB] w-[95%] max-w-4xl h-[90%] rounded-lg overflow-hidden shadow-xl relative flex flex-col"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close"
        >
          <img
            className="w-6 h-6 hover:scale-110 transition-transform"
            src="Cross.svg"
            alt="Close Icon"
          />
        </button>

        {/* Course Content */}
        <div
          style={{
            overflowY: "auto",
            scrollbarWidth: "none", // For Firefox
          }}
          className="flex flex-col items-center mt-8 pt-4 pb-6 px-6 overflow-y-auto"
        >
          {/* Image */}
          {thumbnail ? (
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-6 shadow-md">
              <img
                src={thumbnail}
                alt="Course Thumbnail"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-gray-100 rounded-lg mb-6 flex items-center justify-center shadow-md">
              <span className="text-gray-500 text-lg">No Image Available</span>
            </div>
          )}

          {/* Course Title */}
          <h2 className="text-2xl font-bold text-[#3B82F6] mb-4 text-center">
            {title}
          </h2>

          {/* Course Description */}
          <p className="text-gray-700 mb-4 text-justify leading-6">
            {description}
          </p>

          {/* Additional Details */}
          <div className="w-full text-left bg-[#F9FAFB] px-4 py-4 border rounded-lg">
            <p className="text-gray-800 font-medium mb-2">
              <span className="font-semibold">Instructor: </span>
              {instructor}
            </p>
            {duration ? (
              <p className="text-gray-800 font-medium mb-2">
                <span className="font-semibold">Duration: </span>
                {formatDuration(duration)}
              </p>
            ) : (
              <p className="text-gray-800 font-medium mb-2">
                <span className="font-semibold">Duration: </span>0s
              </p>
            )}
            {price && (
              <p className="text-gray-800 font-medium">
                <span className="font-semibold">Price: $</span>
                {price.trim()}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LearnMore;
