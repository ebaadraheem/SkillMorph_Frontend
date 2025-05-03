const UserInfoCall = async (accessToken: string) => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/info`, {
    method: "GET",
    headers: {
      "ngrok-skip-browser-warning": "skip-browser-warning", // Skip the ngrok browser warning
      "Content-Type": "application/json", // Add other headers if necessary
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
};

const RefreshTokenCall = async () => {
  const refreshResponse = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/auth/refresh`,
    {
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "skip-browser-warning", // Skip the ngrok browser warning
        "Content-Type": "application/json", // Add other headers if necessary
      },
      credentials: "include",
    }
  );
  return refreshResponse;
};
const FetchInstructorCourses = async (id: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/course/instructor-courses/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "skip-browser-warning", // Skip the ngrok browser warning
      },
      credentials: "include",
    }
  );
  return response;
};
const FetchEnrolledCourses = async (id: number) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/course/enrolled-courses/${id}`,
    {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "skip-browser-warning", // Skip the ngrok browser warning
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  return response;
};
export {
  UserInfoCall,
  RefreshTokenCall,
  FetchInstructorCourses,
  FetchEnrolledCourses,
};
