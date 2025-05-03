import { create } from "zustand";
import { FetchInstructorCourses } from "./ApiCalls";

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  duration?: number;
  thumbnail?: string;
  creatorConnectId?: string;
}

interface CoursesState {
  InstructorCourses: Course[];
  loading: boolean;
  setInstructorCourses: (courses: Course[]) => void;
  fetchInstructorCourses: (id: string) => void;
  setisLoading: (loading: boolean) => void;
}

const useInstructorCoursesStore = create<CoursesState>((set) => ({
  InstructorCourses: [],
  loading: false,
  setInstructorCourses: (courses) => set({ InstructorCourses: courses }),
  setisLoading: (loading) => set({ loading }),
  fetchInstructorCourses: async (id) => {
    if (!id) return;
    
    set({ loading: true }); // Set loading to true while fetching

    try {
      const response = await FetchInstructorCourses(id);

      if (!response.ok) {
        throw new Error(`Error fetching courses: ${response.statusText}`);
      }

      const data = await response.json();

      set({ InstructorCourses: data.courses }); // Assuming response has a `courses` property

    } catch (error) {
      console.error(error);
      set({ InstructorCourses: [] }); // Optionally, handle failure with an empty array or error state
    } finally {
      set({ loading: false }); // Set loading to false after fetching
    }
  },
}));

export { useInstructorCoursesStore };
