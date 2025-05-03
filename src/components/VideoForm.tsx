import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Video {
  course_id: number;
  id: number;
  title: string;
  video_url: string;
  duration?: number;
}
interface Props {
  courseVideos: Video[];
  setCourseVideos: React.Dispatch<React.SetStateAction<Video[]>>;
  existingVideoData: Video | null;
  isEditing: boolean;
  setIsVideoCreationVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const VideoForm: React.FC<Props> = ({
  courseVideos,
  setCourseVideos,
  existingVideoData,
  isEditing,
  setIsVideoCreationVisible,
}) => {
  const [title, setTitle] = useState<string>(existingVideoData?.title || "");
  const [duration, setDuration] = useState<number | null>(
    existingVideoData?.duration || null
  );
  const [video, setVideo] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(
    existingVideoData?.video_url || null
  );
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (error) {
      setError("");
    }
  }, [title, videoPreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVideo(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const videoPreviewUrl = reader.result as string;
        setVideoPreview(videoPreviewUrl);

        // Create a video element to get the duration
        const videoElement = document.createElement("video");
        videoElement.src = videoPreviewUrl;

        // Get video duration once metadata is loaded
        videoElement.addEventListener("loadedmetadata", () => {
          const duration = videoElement.duration; // Duration in seconds
          setDuration(duration);
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const HandleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleChangeVideo = () => {
    setVideo(null);
    document.getElementById("videoInput")?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!title.trim() || !videoPreview) {
      setError("Please fill in all the fields");
      return;
    }
    try {
      setIsLoading(true);

      const formData = new FormData();

      // Add video details to FormData
      if (isEditing) {
        formData.append("id", existingVideoData?.id.toString() || "");

        // Check if video URL has changed, add video only if changed
        if (existingVideoData?.video_url !== videoPreview) {
          if (video) formData.append("video", video as Blob);
        } else {
          formData.append("video_url", videoPreview);
        }
      } else {
        formData.append("video", video as Blob);
      }

      formData.append(
        "course_id",
        existingVideoData?.course_id.toString() || ""
      );
      formData.append("title", title);
      formData.append(
        "duration",
        duration ? Math.trunc(duration).toString() : ""
      );

      // Define API endpoint
      const url = isEditing
        ? `${import.meta.env.VITE_SERVER_URL}/videos/update-video/${
            existingVideoData?.id
          }`
        : `${import.meta.env.VITE_SERVER_URL}/videos/add-video`;

      // Send POST request to the server
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        body: formData,
        headers: {
          "ngrok-skip-browser-warning": "skip-browser-warning", // Skip the ngrok browser warning
          
        },
      });

      // Check response status
      if (!response.ok) {
        throw new Error(
          `Failed to ${isEditing ? "update" : "add"} the lecture.`
        );
      }

      // Parse the response
      const data = await response.json();
      if (isEditing) {
        // Update the existing course in the local state
        setCourseVideos(
          courseVideos.map((video) =>
            video.id === data.video.id ? data.video : video
          )
        );
      } else {
        // Add the new course to the local state
        setCourseVideos([...courseVideos, data.video]);
      }

      setIsVideoCreationVisible(false);
    } catch (error) {
      console.error("Error submitting video:", error);
      setError(
        "An error occurred while submitting the lecture. Please try again."
      );
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
      <div className="bg-[#F9FAFB] w-[95%] max-w-4xl h-[90%] rounded-lg overflow-hidden shadow-lg relative flex flex-col p-6">
        <button
          onClick={() => !isLoading && setIsVideoCreationVisible(false)}
          className={`absolute top-3 right-3 text-[#111827] hover:text-[#3B82F6] transition-transform transform ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
          }`}
          aria-label="Close"
        >
          <img className="w-6 h-6" src="Cross.svg" alt="Close Icon" />
        </button>

        <h2 className="text-2xl font-bold text-[#3B82F6] text-center  mb-6">
          {isEditing ? "Update Lecture" : "Add Lecture"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-4  "
          style={{
            overflowY: "auto",
            scrollbarWidth: "none", // For Firefox
          }}
        >
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 gap-1 text-white flex items-center flex-col justify-center bg-opacity-50 bg-[#111827]"
            >
              <h1 className=" font-bold text-center">
                {isEditing ? "Updating" : "Uploading"} Lecture
                <span className=" animate-ping ">...</span>
              </h1>
              <h1 className=" text-center">
                ( Please do not refresh the page or close the browser. It would take a few seconds. )
              </h1>
            </motion.div>
          )}

          <div className="flex flex-col items-center">
            <label className="block text-lg font-bold mb-2 text-[#111827]">
              Upload Lecture Video
            </label>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`${
                videoPreview ? "w-full h-64 sm:h-80 md:h-96" : "w-32 h-32"
              } border border-blue-500 rounded-md flex items-center justify-center focus:ring-2 focus:ring-blue-200 hover:bg-gray-200 transition-all cursor-pointer relative`}
              onClick={() =>
                !videoPreview && document.getElementById("videoInput")?.click()
              }
            >
              {videoPreview ? (
                <video
                  src={videoPreview}
                  className="absolute bg-black inset-0 w-full h-full object-contain rounded-md"
                  controls
                  controlsList="nodownload"
                />
              ) : (
                <img
                  src="upload.svg"
                  alt="Upload"
                  className="w-10 h-10 text-blue-500"
                />
              )}
            </motion.div>
            {videoPreview && (
              <div
                className={`mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition duration-200
      ${
        isLoading
          ? "opacity-50 cursor-not-allowed pointer-events-none"
          : "hover:bg-blue-600 cursor-pointer"
      }`}
                onClick={handleChangeVideo}
              >
                Change Video
              </div>
            )}

            <input
              id="videoInput"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-lg font-bold mb-2 text-[#111827]">
              Lecture Title
            </label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={HandleInputChange}
              placeholder="Enter Lecture title"
              className="w-full p-2 border outline-none focus:ring-2 text-black focus:ring-blue-200 transition-all border-[#3B82F6] bg-[#F9FAFB] rounded-md"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm flexer">{error}</p>}

          <button
            type="submit"
            className={`w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200
            ${
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
              "Update Lecture"
            ) : (
              "Add Lecture"
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default VideoForm;
