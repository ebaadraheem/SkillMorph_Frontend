import { create } from "zustand";

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  instructor: string;
  thumbnail?: string;
  price: string;
  duration?: number;
  stripe_account_id?: string;
  is_enrolled?: boolean;
}

interface CourseResponse {
  success: boolean;
  courses: Course[];
  hasMore: boolean;
  currentPage: number;
  totalCourses: number;
}

// Store state interface
interface CoursesState {
  courses: Course[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  setCourses: (courses: Course[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHasMore: (hasMore: boolean) => void;
  setCurrentPage: (page: number) => void;
  fetchCourses: (userId: string, pageNum: number, search?: string) => void;
}

const useCourseStore = create<CoursesState>((set) => ({
  courses: [],
  loading: true,
  error: null,
  hasMore: true,
  currentPage: 1,

  setCourses: (courses) => set({ courses }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setHasMore: (hasMore) => set({ hasMore }),
  setCurrentPage: (page) => set({ currentPage: page }),

  // The fetchCourses function to fetch courses from API
  fetchCourses: async (
    userId: string | "not_authenticated",
    pageNum: number,
    search?: string
  ) => {
    try {
      set({ loading: true, error: null }); // Set loading state to true
      const queryParams = new URLSearchParams({
        page: pageNum.toString(),
        userId: userId.toString(),
        ...(search && { search: search.trim() }),
      });
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/course/all-courses?${queryParams}`,
        {
          method: "GET", // Ensure the correct HTTP method
          headers: {
            "ngrok-skip-browser-warning": "skip-browser-warning", // Skip the ngrok browser warning
            "Content-Type": "application/json", // Add other headers if necessary
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data: CourseResponse = await response.json();

      // Set the courses and pagination state
      if (pageNum === 1) {
        set({ courses: data.courses, currentPage: 1 });
      } else {
        set((state) => ({
          courses: [...state.courses, ...data.courses],
          currentPage: pageNum,
        }));
      }

      set({ hasMore: data.hasMore }); // Set whether there are more courses
    } catch (error: any) {
      set({ error: error.message });
      console.error("Error fetching courses:", error);
    } finally {
      set({ loading: false });
    }
  },
}));

export { useCourseStore };
