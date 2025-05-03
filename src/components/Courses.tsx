import EnrollCard from "../Custom/EnrollCard";
import { motion } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import { useCourseStore } from "../store/CourseStore";
import { useAuthenticationStore } from "../store/AuthStore";

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  price: string;
  instructor: string;
  duration?: number;
  thumbnail?: string;
  is_enrolled?: boolean;
  stripe_account_id?: string;
}

const Courses = () => {
  const { courses, fetchCourses, loading, hasMore, setCourses } =
    useCourseStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Course[]>([]);
  const { user } = useAuthenticationStore();

  // Reference for the intersection observer
  const observer = useRef<IntersectionObserver | null>(null);

  const lastCourseElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchCourses(
            user ? user.user_id : "not_authenticated",
            courses.length / 6 + 1,
            searchQuery
          );
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchCourses, courses.length, searchQuery, user]
  );

  // Handle search
  const handleSearch = (query: string) => {
    setCourses([]); // Clear the previous courses
    fetchCourses(user ? user.user_id : "not_authenticated", 1, query); // Fetch courses with the search query
    setSuggestions([]); // Clear suggestions
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter courses for suggestions
    if (query.trim() === "") {
      setSuggestions([]);
      fetchCourses(user ? user.user_id : "not_authenticated", 1); // Fetch courses without a search query
    } else {
      const filteredSuggestions = courses.filter((course) =>
        course.title.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    }
  };

  // Handle enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (searchQuery.trim() !== "") handleSearch(searchQuery);
    }
    setSuggestions([]); // Clear suggestions
  };

  // Handle suggestion click
  const handleSuggestionClick = (title: string) => {
    setSearchQuery(title);
    handleSearch(title); // Trigger search
    setSuggestions([]); // Clear suggestions
  };

  // Initial fetch and pagination (Only if the searchQuery is empty)
  useEffect(() => {
    if (!searchQuery) {
      fetchCourses(user ? user.user_id : "not_authenticated", 1); // Fetch courses for the first page
    }
  }, [searchQuery, fetchCourses, user]);

  return (
    <motion.div
      className="min-h-screen w-full p-2 sm:p-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full">
        {/* Header Section */}
        <header className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-3 py-6 sm:px-4 sm:py-8 text-center rounded-lg shadow-lg relative overflow-hidden">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2 sm:mb-4">
            Master Your Skills with Our Courses
          </h1>
          <p className="text-sm sm:text-base lg:text-lg font-medium">
            Explore expertly crafted courses designed to help you learn, grow,
            and achieve your goals. Start your journey today!
          </p>
        </header>

        {/* Search Bar Section */}
        <div className="flex items-center gap-2 sm:gap-4 mt-6 sm:mt-8 mb-4 px-2 sm:px-6 lg:px-12">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div
                style={{
                  overflowY: "auto",
                  scrollbarWidth: "thin",
                }}
                className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                {suggestions.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => handleSuggestionClick(course.title)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    {course.title}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => handleSearch(searchQuery)}
            disabled={searchQuery.trim() === ""}
            className="max-xs:text-sm px-2 xs:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Courses Section */}
        <section className="mt-6 sm:mt-8 px-2 sm:px-4" id="courses">
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-center">
            <h2 className="w-full underline">Available Courses</h2>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {courses &&
              courses.map((course, index) => {
                if (courses.length === index + 1 && hasMore && !loading) {
                  return (
                    <div ref={lastCourseElementRef} key={course.id}>
                      <EnrollCard {...course} />
                    </div>
                  );
                }
                return <EnrollCard key={course.id} {...course} />;
              })}
          </div>

          {loading && (
            <div className="col-span-1  h-[53vh] flexer sm:col-span-2 lg:col-span-3 py-4">
              <img className=" w-8 h-8 animate-spin" src="loading.svg" alt="" />
            </div>
          )}

          {!loading && courses.length === 0 && (
            <div className="flex items-center justify-center h-[53vh] text-gray-500 text-sm sm:text-base">
              {searchQuery
                ? `No courses found for "${searchQuery}"`
                : "No courses available"}
            </div>
          )}
        </section>
      </div>
    </motion.div>
  );
};

export default Courses;
