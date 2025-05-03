import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import EnrollCard from "../Custom/EnrollCard";
import { useEffect } from "react";
import { useCourseStore } from "../store/CourseStore";
import { ScrollTop } from "../Custom/Components";
import { useAuthenticationStore } from "../store/AuthStore";

const Home = () => {
  const navigate = useNavigate();
  const { courses, fetchCourses, loading } = useCourseStore();
  const { user } = useAuthenticationStore();

  useEffect(() => {
    fetchCourses(user ? user.user_id : "not_authenticated", 1);
  }, [user]);

  return (
    <motion.div
      className="min-h-screen bg-[#F9FAFB]  p-4 flex flex-col"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      {/* Content Section */}
      <div className="flex flex-col  w-full flex-grow">
        {/* Header */}
        <header className="bg-gradient-to-r from-[#3B82F6] to-[#10B981] text-white px-4 py-8 text-center rounded-lg shadow-lg relative overflow-hidden">
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
            Empower Your Learning Journey
          </h1>
          <p className="text-base sm:text-lg font-medium mt-2">
            Discover courses, learn and access exclusive
            resources to excel in your learning journey.
          </p>
        </header>

        {/* Courses Section */}
        <section className="mt-8  flex-grow" id="courses">
          <h2 className="text-2xl font-bold text-[#111827] mb-4 text-center">
            Available Courses
          </h2>
          {loading ? (
            <div className="flex  h-[50vh] justify-center items-center ">
              <img
                src="loading.svg"
                alt="Loading"
                className="w-8 h-8 animate-spin"
              />
            </div>
          ) : courses.length > 0 ? (
            <>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <EnrollCard key={course.id} {...course} />
                ))}
              </div>
              {/* Button for more courses */}
              <div className="mt-6 text-center ">
                <button
                  onClick={() => {
                    ScrollTop();
                    navigate("/skillsdashboard?view=allcourses");
                  }}
                  className="text-[#3B82F6] hover:text-[#10B981] font-bold"
                >
                  View More
                </button>
              </div>
            </>
          ) : (
            <p className="text-center h-[50vh] flexer  text-[#6B7280]">
              No courses available
            </p>
          )}
        </section>
      </div>

      
    </motion.div>
  );
};

export default Home;
