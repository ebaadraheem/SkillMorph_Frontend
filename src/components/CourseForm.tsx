import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthenticationStore } from "../store/AuthStore";
import { useInstructorCoursesStore } from "../store/InstructorStore";

interface CourseCreationData {
  course_id?: string;
  title: string;
  description: string;
  category: string;
  price: number;
  thumbnail: File | null;
  stripe_account_id: string;
}
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

interface Props {
  setIsCourseCreationVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isEditing: boolean;
  setisEditing: React.Dispatch<React.SetStateAction<boolean>>;
  existingCourseData: Course | null;
  setexistingCourseData: React.Dispatch<React.SetStateAction<Course | null>>;
}

const CourseForm: React.FC<Props> = ({
  setIsCourseCreationVisible,
  isEditing,
  setisEditing,
  existingCourseData,
  setexistingCourseData,
}) => {
  const [courseData, setCourseData] = useState<CourseCreationData>({
    course_id: existingCourseData?.id.toString(),
    title: existingCourseData?.title || "",
    description: existingCourseData?.description || "",
    category: existingCourseData?.category || "",
    price: existingCourseData?.price || 0.0,
    thumbnail: null,
    stripe_account_id: "",
  });

  const { user } = useAuthenticationStore();
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [displayValue, setDisplayValue] = useState(
    existingCourseData?.price.toString() || ""
  );
  const { InstructorCourses } = useInstructorCoursesStore();
  const { setInstructorCourses } = useInstructorCoursesStore();

  useEffect(() => {
    if (isEditing && existingCourseData) {
      setThumbnailPreview(existingCourseData.thumbnail as unknown as string); // Assume the thumbnail URL is available
    }
  }, [isEditing, existingCourseData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // Set character limits for title and description
    const titleLimit = 220;
    const descriptionLimit = 3000;
    // Check length limits
    if (
      (name === "title" && value.length > titleLimit) ||
      (name === "description" && value.length > descriptionLimit)
    ) {
      setError(
        `${
          name === "title"
            ? `Title must be ${titleLimit} characters or less.`
            : `Description must be ${descriptionLimit} characters or less.`
        }`
      );
      return;
    }

    // Update state
    setCourseData({ ...courseData, [name]: value });
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, or GIF)");
        return;
      }

      // Validate file size (e.g., 5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setError("File size must be less than 5MB");
        return;
      }

      setCourseData({ ...courseData, thumbnail: file });
      setThumbnailPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCourseData({ ...courseData, category: e.target.value });
    setError(null);
  };

  useEffect(() => {
    if (error) {
      if (
        (error.includes("Title") && courseData.title) ||
        (error.includes("Description") && courseData.description) ||
        (error.includes("category") && courseData.category)
      ) {
        setError(null);
      }
    }
  }, [courseData]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow digits and decimal point
    if (!/^[\d.]*$/.test(value)) {
      return;
    }

    // Handle empty input
    if (value === "") {
      setDisplayValue("");
      setCourseData({ ...courseData, price: 0 });
      return;
    }

    // Count decimal points
    const decimalCount = (value.match(/\./g) || []).length;
    if (decimalCount > 1) {
      return;
    }

    // Check if the number part (before decimal) exceeds 99999
    const parts = value.split(".");
    if (parts[0].length > 5 || parseInt(parts[0]) > 99999) {
      return;
    }

    // If there's a decimal point, limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return;
    }

    // Update values only if all validations pass
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue) || value === "." || value.endsWith(".")) {
      setDisplayValue(value);
      if (value.endsWith(".")) {
        setCourseData({ ...courseData, price: parsedValue || 0 });
      } else {
        setCourseData({ ...courseData, price: parsedValue || 0 });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !courseData.title ||
      !courseData.description ||
      !courseData.category ||
      (courseData.thumbnail === null && !existingCourseData?.thumbnail)
    ) {
      setError("All fields are required.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("id", courseData.course_id || "");
      formData.append("title", courseData.title);
      formData.append("description", courseData.description);
      formData.append("category", courseData.category);
      formData.append("price", courseData.price.toString());
      formData.append("thumbnail", existingCourseData?.thumbnail || "");
      formData.append("stripe_account_id", user?.stripe_account_id || "");
      if (courseData.thumbnail) {
        formData.append("newthumbnail", courseData.thumbnail || "");
      }

      formData.append("instructor_id", user?.user_id || "");

      const url = isEditing
        ? `${import.meta.env.VITE_SERVER_URL}/course/update-course/`
        : `${import.meta.env.VITE_SERVER_URL}/course/create-course`;

      const method = "POST";

      const response = await fetch(url, {
        method,
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to submit course data.");
      }

      const data = await response.json();
      if (isEditing) {
        // Update the course in the local state
        const updatedCourses = InstructorCourses.map((course) =>
          course.id === existingCourseData?.id ? data.course : course
        );
        setInstructorCourses(updatedCourses);
      } else {
        // Add the new course to the local state
        setInstructorCourses([...InstructorCourses, data.course]);
      }

      setCourseData({
        title: "",
        description: "",
        category: "",
        price: 0.0,
        thumbnail: null,
        stripe_account_id: user?.stripe_account_id || "",
      });
      setThumbnailPreview(null);
      setDisplayValue("");
      setisEditing(false);
      setexistingCourseData(null);
      setIsCourseCreationVisible(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 bg-[#111827]"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      {isLoading && (
        <div className="fixed inset-0 z-50 gap-1 text-white flex items-center flex-col justify-center bg-opacity-50 bg-transparent"></div>
      )}
      <div className="bg-[#F9FAFB] w-[95%] max-w-4xl h-[90%] rounded-lg overflow-hidden shadow-lg relative flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => {
            if (!isLoading) {
              setisEditing(false);
              setIsCourseCreationVisible(false);
              setexistingCourseData(null);
            }
          }}
          className={`absolute top-3 right-3 text-[#111827] hover:text-[#3B82F6] focus:outline-none transition-transform transform ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
          }`}
          aria-label="Close"
        >
          <img className="w-6 h-6" src="Cross.svg" alt="Close Icon" />
        </button>

        {/* Course Creation Form */}
        <div
          style={{
            overflowY: "auto",
            scrollbarWidth: "thin", // For Firefox
          }}
          className="px-6 pb-6  mt-8"
        >
          <h2 className="text-2xl text-[#3B82F6] font-bold mb-6 text-center">
            {isEditing ? "Update Course" : "Create a New Course"}
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Thumbnail Input */}
            <div className="mb-6 flex flex-col">
              <label className="block text-[#111827] text-lg font-bold mb-2">
                Thumbnail
              </label>
              <div
                className="w-32 h-32 border border-[#3B82F6] rounded-md flex items-center justify-center focus:ring-2 focus:ring-blue-200 hover:bg-[#E5E7EB] transition-all cursor-pointer bg-[#F9FAFB] relative"
                onClick={() =>
                  document.getElementById("thumbnailInput")?.click()
                }
              >
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="absolute inset-0 w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <span className=" text-2xl">
                    <img src="upload.svg" alt="Upload" className="w-8 h-8" />
                  </span>
                )}
              </div>
              <input
                id="thumbnailInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Other Form Inputs */}
            <div className="mb-4">
              <label className="block text-lg font-bold mb-2 text-[#111827]">
                Course Title
              </label>
              <input
                type="text"
                name="title"
                value={courseData.title}
                onChange={handleInputChange}
                placeholder="Enter course title"
                className="w-full p-2 border outline-none focus:ring-2 focus:ring-blue-200 transition-all border-[#3B82F6] bg-[#F9FAFB] rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-lg font-bold mb-2 text-[#111827]">
                Description
              </label>
              <textarea
                style={{
                  overflowY: "auto",
                  scrollbarWidth: "thin", // For Firefox
                }}
                name="description"
                value={courseData.description}
                onChange={handleInputChange}
                placeholder="Enter course description"
                className="w-full outline-none p-2 border focus:ring-2 focus:ring-blue-200 transition-all bg-[#F9FAFB] border-[#3B82F6] rounded-md"
                rows={4}
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-lg font-bold mb-2 text-[#111827]">
                Category
              </label>
              <select
                name="category"
                value={courseData.category}
                onChange={handleCategoryChange}
                className="w-full cursor-pointer border border-[#3B82F6] bg-[#F9FAFB] outline-none rounded-md focus:ring-2 focus:ring-blue-200 transition-all py-2 px-3 text-sm sm:text-base"
              >
                <option value="" disabled>
                  Select a Category
                </option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Business">Business</option>
              </select>
            </div>

            <div className="mb-4">
              <label className=" text-lg font-bold mb-2 text-[#111827] flex items-center justify-between">
                <span>Price</span>
                <span className="text-sm font-normal text-gray-500">
                  (0-99,999 USD)
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="text"
                  name="price"
                  value={displayValue}
                  onChange={handlePriceChange}
                  placeholder="0.00"
                  className="w-full p-2 pl-7 outline-none border border-[#3B82F6] rounded-md focus:ring-2 focus:ring-blue-200 transition-all"
                  required
                  inputMode="decimal"
                  autoComplete="off"
                  onKeyDown={(e) => {
                    // Allow only: numbers, backspace, delete, arrow keys, tab, decimal point
                    if (
                      !/[\d.]/.test(e.key) && // not a number or decimal point
                      ![
                        "Backspace",
                        "Delete",
                        "ArrowLeft",
                        "ArrowRight",
                        "Tab",
                      ].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                    // Prevent decimal point if one already exists
                    if (e.key === "." && displayValue.includes(".")) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Enter price with up to 2 decimal places
              </p>
            </div>

            {/* Error Message */}
            {error && <div className="text-red-500 flexer mb-4">{error}</div>}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-md bg-[#3B82F6] text-white  transition-colors ${
                isLoading
                  ? "opacity-50  cursor-not-allowed"
                  : "hover:bg-[#2563EB]"
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <img
                  src="loading.svg"
                  alt="Loading..."
                  className="w-6 h-6 mx-auto animate-spin"
                />
              ) : isEditing ? (
                "Update Course"
              ) : (
                "Create Course"
              )}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseForm;
