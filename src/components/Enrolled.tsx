import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CoursePlay from "./CoursePlay";
import { useSearchParams } from "react-router-dom";
import { ScrollTop } from "../Custom/Components";
import { useAuthenticationStore } from "../store/AuthStore";
import { GetDuration } from "../Custom/Components";

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  duration?: number;
  stripe_account_id?: string;
  instructor?: string;
  thumbnail?: string;
}

const Enrolled: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthenticationStore();
  const [IsSelectedVideo, setIsSelectedVideo] = useState(false);
  const [EnrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);


  useEffect(() => {
    if (user) {
      FetchEnrolledCourses(user.user_id);
    }
  }, [user]);

  useEffect(() => {
    const courseId = searchParams.get("courseid");
    const view = searchParams.get("view") || "";
    if (courseId && view === "enrolled") {
      setIsSelectedVideo(true);
    } else {
      setIsSelectedVideo(false);
    }
  }, [searchParams]);

  const handleCourseClick = (course: Course) => {
    const courseId = course.id.toString();
    const view = searchParams.get("view") || "";
    // Update the URL with the 'courseid' parameter and optionally replace history
    setSearchParams(
      {
        view: view,
        courseid: String(courseId),
      },
      { replace: true }
    );
    ScrollTop();
  };
  const openModal = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(true);
    const course = EnrolledCourses.find((course) => course.id === id);
    setSelectedCourse(course || null);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  const DisEnroll = async (courseId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/course/disenroll/${
          user?.user_id
        }/${courseId}`,
        {
          method: "DELETE",
          headers: {
            "ngrok-skip-browser-warning": "skip-browser-warning", // Skip the ngrok browser warning
            "Content-Type": "application/json", // Add other headers if necessary
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error dis-enrolling course: ${response.statusText}`);
      }

      await response.json();

      const updatedCourses = EnrolledCourses.filter(
        (course) => course.id !== courseId
      );

      setEnrolledCourses(updatedCourses);
      closeModal();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const FetchEnrolledCourses = async (userId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/course/enrolled-courses/${userId}`,
        {
          method: "GET", // Make sure to specify the correct HTTP method
          headers: {
            "ngrok-skip-browser-warning": "skip-browser-warning", // Skip the ngrok browser warning
            "Content-Type": "application/json", // Add other headers if necessary
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching courses: ${response.statusText}`);
      }

      const data = await response.json();

      setEnrolledCourses(data.courses);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackButton = () => {
    setIsSelectedVideo(false);
    const view = searchParams.get("view") || "";
    setSearchParams({ view: view }, { replace: true });
  };

  if (isLoading) {
    return (
      <div className="flex  h-[70vh] items-center justify-center p-8">
        <img className="w-8 h-8 animate-spin" src="loading.svg" alt="" />
      </div>
    );
  }
  if (EnrolledCourses.length === 0) {
    return (
      <div className="flex  h-[70vh] items-center justify-center p-8">
        <h2 className="flex items-center justify-center h-[53vh]  text-sm sm:text-base">
          No Enrolled Courses
        </h2>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      {showModal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 bg-[#111827]"
        >
          <div className="bg-white rounded-lg shadow-lg w-11/12 sm:w-1/3 p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Confirm Deletion
            </h2>
            <p className="text-gray-700">
              Are you sure you want to Dis-Enroll from this course. This action
              is irreversible.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                className={`px-6 py-2 text-white bg-[#3B82F6] rounded-md hover:bg-[#2563EB] transition-colors ${
                  isLoading ? "cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={() => DisEnroll(selectedCourse?.id as number)}
                className={`px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors ${
                  isLoading ? "cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <img
                    className="w-6 h-6 mx-auto animate-spin"
                    src="loading.svg"
                    alt="loading..."
                  />
                ) : (
                  "Dis-Enroll"
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
      {IsSelectedVideo ? (
        <div className="flex-1 min-h-full ">
          <div
            onClick={handleBackButton}
            className="inline-block cursor-pointer hover:bg-slate-200 rounded-full p-2"
          >
            <img className="w-6 h-6" src="leftarrow.svg" alt="Back" />
          </div>
          <div className="flex-1">
            <CoursePlay isEditing={false} />
          </div>
        </div>
      ) : (
        <motion.div
          className="flex-1 min-h-[78vh] p-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <>
            <h2 className="text-2xl font-bold text-[#111827] mb-4 underline text-center">
              Enrolled Courses
            </h2>
            <div className="grid gap-6 xl:grid-cols-3">
              {EnrolledCourses.map((course) => (
                <div
                  onClick={() => handleCourseClick(course)}
                  key={course.id}
                  className="bg-white  p-6 cursor-pointer rounded-lg shadow-md hover:shadow-xl transition-shadow flex flex-col"
                >
                  {course.thumbnail && (
                    <div className="mb-4">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-[#3B82F6]">
                    {course.title}
                  </h3>
                  <p className="text-[#6B7280] mt-2">By {course.instructor}</p>
                  <p className="text-[#111827] mt-2 line-clamp-3">
                    {course.description}
                  </p>

                  <div className="flex items-end flex-grow  bottom-0 relative  justify-between">
                    {course.duration && (
                      <p className=" flexer text-sm text-[#6B7280]">
                        Duration: {GetDuration(course.duration)}
                      </p>
                    )}
                    <img
                      onClick={(e) => openModal(course.id, e)}
                      className="w-7 h-7 rounded-md transition-transform transform hover:scale-105 cursor-pointer hover:bg-gray-100 m-1 pointer-events-auto"
                      src="delete.svg"
                      alt="Delete"
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        </motion.div>
      )}
    </div>
  );
};

export default Enrolled;
