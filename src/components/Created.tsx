import React, { useState, useEffect } from "react";
import CourseForm from "./CourseForm";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import CoursePlay from "./CoursePlay";
import { ScrollTop } from "../Custom/Components";
import { useAuthenticationStore } from "../store/AuthStore";
import { useInstructorCoursesStore } from "../store/InstructorStore";
import { GetDuration } from "../Custom/Components";
import toast from "react-hot-toast";

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  duration?: number;
  thumbnail?: string;
  stripe_account_id?: string;
}
const Created: React.FC = () => {
  const [isCourseCreationVisible, setIsCourseCreationVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    InstructorCourses,
    fetchInstructorCourses,
    setInstructorCourses,
    loading,
  } = useInstructorCoursesStore();
  const [isSelectedcourse, setIsSelectedcourse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { user } = useAuthenticationStore();
  const [isEditing, setisEditing] = useState(false);
  const toggleCourseCreationForm = () => {
    setIsCourseCreationVisible((prev) => !prev);
  };

  useEffect(() => {
    if (user) {
      fetchInstructorCourses(user.user_id);
    }
  }, [user]);

  useEffect(() => {
    const courseId = searchParams.get("courseid");
    const view = searchParams.get("view") || "";
    if (courseId && view === "created") {
      setIsSelectedcourse(true);
    } else {
      setIsSelectedcourse(false);
    }
  }, [searchParams]);

  // Handler for course selection
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
    setSelectedCourse(course);
    setIsSelectedcourse(true); // This flag can be used to manage course selection
  };

  const openModal = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(true);
    const course = InstructorCourses.find((course) => course.id === id);
    setSelectedCourse(course || null);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  const BackButton = () => {
    setIsSelectedcourse(false);
    const view = searchParams.get("view") || "";
    setSearchParams({ view: view }, { replace: true }); // Clear courseid
  };

  const handleEdit = (course: Course, e: React.MouseEvent) => {
    e.stopPropagation();
    setisEditing(true);
    setSelectedCourse(course);
    setIsCourseCreationVisible(true);
  };

  const HandleDelete = async () => {
    if (selectedCourse === null) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/course/delete-course/${
          selectedCourse.id
        }/${user?.user_id}`,
        {
          method: "DELETE",
        }
      );
      if(response.status==400)
      {
        toast.error("You cannot delete a course that has enrolled students.");
        setIsLoading(false);
        return;
      }
     

      const newCourses = InstructorCourses.filter(
        (course) => course.id !== selectedCourse.id
      );
      setInstructorCourses(newCourses);
    } catch (error) {
      console.error("Error deleting the course:", error);
      alert("Failed to delete the course. Please try again.");
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  if (user?.role === "instructor" && user?.stripe_account_id === "empty") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="flex h-[74vh] flex-col gap-1  items-center justify-center p-8"
      >
        <h1 className=" text-center">
          Please Set Up Your Payment Account to Create Courses
        </h1>
      </motion.div>
    );
  }
  if (loading) {
    return (
      <div className="col-span-1 h-[65vh] flexer sm:col-span-2 lg:col-span-3 py-4">
        <img className=" w-8 h-8 animate-spin" src="loading.svg" alt="" />
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-[78vh] w-full  flex"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-1 ml-0 ">
        {/* Show "Create Course" button if no courses are available */}
        {InstructorCourses.length === 0 && !loading ? (
          <div className="h-full flex items-center justify-center">
            <button
              onClick={toggleCourseCreationForm}
              className="bg-gradient-to-r from-[#3B82F6] to-[#10B981] text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform"
            >
              Create Course
            </button>

            {isCourseCreationVisible && (
              <CourseForm
                setIsCourseCreationVisible={toggleCourseCreationForm}
                isEditing={isEditing}
                setisEditing={setisEditing}
                existingCourseData={selectedCourse}
                setexistingCourseData={setSelectedCourse}
              />
            )}
          </div>
        ) : isSelectedcourse ? (
          <div className="flex-1 ">
            {/* Back Button */}
            <div className="  flex items-center  justify-between pb-2">
              <div
                onClick={BackButton} // Move the click handler to the parent for better semantics
                className="cursor-pointer p-2 rounded-full flex items-center hover:bg-slate-200 transition duration-200"
              >
                <img className="w-6 h-6" src="leftarrow.svg" alt="Back" />
              </div>
            </div>

            {/* course Player */}
            <div className="flex-1">
              <CoursePlay isEditing={true} />
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className=" ml-10 md:ml-20 flex items-center justify-between  font-bold py-2 text-[#111827] ">
              <div className="text-2xl text-center flex-1 underline">Your Courses</div>
              <button
                onClick={toggleCourseCreationForm}
                className="bg-gradient-to-r flexer gap-1 from-[#3B82F6] to-[#10B981] text-white md:px-4 px-2 py-2 rounded-full md:rounded-lg hover:scale-105 transition-transform"
              >
                <span className=" max-md:hidden">Create </span>
                <img className=" md:w-3 md:h-3 w-4 h-4" src="plus.svg" alt="" />
              </button>
            </div>
            {isCourseCreationVisible && (
              <CourseForm
                setIsCourseCreationVisible={toggleCourseCreationForm}
                isEditing={isEditing}
                setisEditing={setisEditing}
                existingCourseData={selectedCourse}
                setexistingCourseData={setSelectedCourse}
              />
            )}
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
                    Are you sure you want to delete this course? This action
                    cannot be undone.
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
                      onClick={HandleDelete}
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
                        "Delete"
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
            {/* Courses */}

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {InstructorCourses &&
                InstructorCourses.map((course) => (
                  <div
                    onClick={() => handleCourseClick(course)}
                    key={course.id}
                    className="bg-white p-6 sm:p-4 md:p-5 cursor-pointer rounded-lg shadow-md hover:shadow-xl transition-shadow flex flex-col h-full"
                  >
                    {/* Course Image */}
                    {course.thumbnail && (
                      <div className="mb-4  rounded-md">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-xl font-bold text-[#3B82F6] line-clamp-2">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[#111827] mt-2 line-clamp-3 flex-grow">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      {/* Course Duration */}
                      {
                        <p className="mt-2 text-sm text-[#6B7280]">
                          Duration: {GetDuration(course.duration || 0)}
                        </p>
                      }

                      <div className="flex items-center">
                        <img
                          onClick={(e) => handleEdit(course, e)}
                          className="w-7 h-7 rounded-md transition-transform transform hover:scale-105 cursor-pointer hover:bg-gray-200 m-1 pointer-events-auto"
                          src="edit.svg"
                          alt="Edit"
                        />
                        <img
                          onClick={(e) => openModal(course.id, e)}
                          className="w-7 h-7 rounded-md transition-transform transform hover:scale-105 cursor-pointer hover:bg-gray-100 m-1 pointer-events-auto"
                          src="delete.svg"
                          alt="Delete"
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Created;
