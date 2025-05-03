import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import VideoForm from "./VideoForm";

interface Video {
  course_id: number;
  id: number;
  title: string;
  video_url: string;
  duration?: number;
}
interface Props {
  isEditing: boolean;
}
const CoursePlay: React.FC<Props> = ({ isEditing }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentCourse, setCurrentCourse] = useState<any>(null);
  const [isEditingVideo, setisEditingVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [courseVideos, setCourseVideos] = useState<Video[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoCreationVisible, setIsVideoCreationVisible] = useState(false);

  const courseId = searchParams.get("courseid");
  const view = searchParams.get("view");
  const videoId = searchParams.get("videoid");

  useEffect(() => {
    if (courseId && !currentCourse) {
      fetchCourseData();
    }
  }, [courseId, currentCourse]);

  useEffect(() => {
    if (currentVideo === null && courseVideos.length > 0) {
      setCurrentVideo(courseVideos[0]);
    }
  }, [courseVideos]);

  useEffect(() => {
    if (courseVideos.length > 0 && !videoId) {
      setSearchParams(
        {
          view: String(view),
          courseid: String(courseId),
          videoid: String(courseVideos[0].id),
        },
        { replace: true }
      );
    }
  }, [courseVideos, videoId]);

  const fetchCourseData = async () => {
    
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/course/coursedata/${courseId}`,
        {
          method: "GET", // Make sure to specify the correct HTTP method
          headers: {
            "ngrok-skip-browser-warning": "skip-browser-warning", // Skip the ngrok browser warning
            "Content-Type": "application/json", // Add other headers if necessary
          },
        }
      );


      const data = await response.json();
      setCurrentCourse(data.course);
      setCourseVideos(data.videos || []);
      const firstVideo = videoId
        ? data.videos.find((video: Video) => video.id === Number(videoId))
        : data.videos[0];
      if (firstVideo) {
        setCurrentVideo(firstVideo);
      }
    } catch (error) {
      console.error("Error fetching course data", error);
    }
    setIsLoading(false);
  };

  const handleVideoChange = (video: Video) => {
    setCurrentVideo(video);
    setSearchParams(
      {
        view: String(view),
        courseid: String(courseId),
        videoid: String(video.id),
      },
      { replace: true }
    );
  };

  const openModal = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(true);
    const selected = courseVideos.find((video) => video.id === id);
    if (selected) {
      setSelectedVideo(selected);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVideo(null);
  };
  const HandleAddVideo = (courseId: string | null) => {
    setSelectedVideo({
      course_id: Number(courseId),
      id: 0,
      title: "",
      video_url: "",
    });
    setisEditingVideo(false);
    setIsVideoCreationVisible(true);
  };
  const handleEdit = (video: Video, e: any) => {
    e.stopPropagation();
    setSelectedVideo(video);
    setisEditingVideo(true);
    setIsVideoCreationVisible(true);
  };

  const HandleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/videos/deletevideo/${
          selectedVideo?.id
        }`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {

        // Updating the course videos
        const updatedVideos = courseVideos.filter(
          (video) => video.id !== selectedVideo?.id
        );
        setCourseVideos(updatedVideos);

        // Check if the deleted video was the current video
        if (currentVideo?.id === selectedVideo?.id) {
          if (updatedVideos.length > 0) {
            setCurrentVideo(updatedVideos[0]);
            setSearchParams(
              {
                view: String(view),
                courseid: String(courseId),
                videoid: String(updatedVideos[0].id),
              },
              { replace: true }
            );
          } else {
            setCurrentVideo(null);
            setSearchParams(
              {
                view: String(view),
                courseid: String(courseId),
              },
              { replace: true }
            );
          }
        }
        setSelectedVideo(null);
        closeModal();
      } else {
        console.error("Failed to delete video");
      }
    } catch (error) {
      console.error("Error deleting video", error);
    } finally {
      setIsLoading(false);
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <img
          className="w-7 h-7 animate-spin"
          src="loading.svg"
          alt="loading..."
        />
      </div>
    );
  }

  return (
    <>
      {courseVideos.length === 0 ? (
        isEditing ? (
          <motion.div
            className="flex text-black flex-col gap-2 w-full h-[70vh]  items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {/* <h2 className="text-xl  font-bold">No Lecture added yet</h2> */}
            {isEditing && (
              <div className="flexer">
                <button
                  onClick={() => HandleAddVideo(courseId)}
                  className="bg-gradient-to-r flexer w-52 gap-1 from-[#3B82F6] to-[#10B981] text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform"
                >
                  <span>Add </span>
                  <img
                    className=" md:w-3 md:h-3 w-4 h-4"
                    src="plus.svg"
                    alt=""
                  />
                </button>
              </div>
            )}
            {isVideoCreationVisible && (
              <VideoForm
                isEditing={isEditingVideo}
                courseVideos={courseVideos}
                setCourseVideos={setCourseVideos}
                existingVideoData={selectedVideo}
                setIsVideoCreationVisible={setIsVideoCreationVisible}
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col text-black w-full h-[70vh]  items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl  font-bold">No Lectures available</h2>
          </motion.div>
        )
      ) : (
        <motion.div
          className="flex flex-col w-full h-screen text-white"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {/* Video Player */}
          <div className=" lg:h-[70vh] h-[60vh] w-full rounded-md bg-black mb-4">
            {currentVideo ? (
              <video
                key={currentVideo.id}
                controls
                autoPlay
                controlsList="nodownload"
                className="w-full h-full shadow-lg rounded-lg"
                onContextMenu={(e) => e.preventDefault()} // Disable right-click
              >
                <source src={currentVideo.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p className="h-full flex justify-center items-center">
                Loading video...
              </p>
            )}
          </div>

          {isVideoCreationVisible && (
            <VideoForm
              isEditing={isEditingVideo}
              courseVideos={courseVideos}
              setCourseVideos={setCourseVideos}
              existingVideoData={selectedVideo}
              setIsVideoCreationVisible={setIsVideoCreationVisible}
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
                  Are you sure you want to delete this video? This action cannot
                  be undone.
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

          {/* Video List */}
          <div
            style={{
              overflowY: "auto",
              scrollbarWidth: "none", // For Firefox
            }}
            className="flex-1 p-4 rounded-md bg-[#111827]"
          >
            <h2 className="text-2xl max-xs:text-xl text-center flex justify-center font-bold mb-4">
              {currentCourse?.title}
            </h2>
            <ul className="space-y-4">
              {courseVideos.map((video) => (
                <li
                  key={video.id}
                  className={`p-4 transition-all gap-1 flex items-center justify-between max-sm:text-sm rounded-lg cursor-pointer ${
                    currentVideo?.id === video.id
                      ? "bg-[#3B82F6]"
                      : "bg-gray-700 hover:bg-[#3B82F6]"
                  }`}
                  onClick={() => handleVideoChange(video)}
                >
                  <h3 className="font-bold">{video.title}</h3>
                  <div className="flex gap-2">
                    {!isEditing && video.duration && (
                      <span className="text-sm font-semibold">
                        {(() => {
                          if (video.duration > 3600) {
                            const hours = Math.floor(video.duration / 3600);
                            const minutes = Math.floor(
                              (video.duration - hours * 3600) / 60
                            );
                            const seconds =
                              video.duration - hours * 3600 - minutes * 60;
                            return `${hours.toFixed(0)}h ${minutes.toFixed(
                              0
                            )}m ${seconds.toFixed(0)}s`;
                          } else if (video.duration > 60) {
                            const minutes = Math.floor(video.duration / 60);
                            const seconds = video.duration - minutes * 60;
                            return `${minutes.toFixed(0)}m ${seconds.toFixed(
                              0
                            )}s`;
                          } else {
                            return `${video.duration.toFixed(0)}s`;
                          }
                        })()}
                      </span>
                    )}

                    {isEditing && (
                      <div className="flex items-center gap-1">
                        <div
                          onClick={(e) => handleEdit(video, e)}
                          className="w-7 h-7 rounded-md transition-transform transform hover:scale-105 cursor-pointer hover:bg-gray-200 m-1"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M14.802 6.445L8.696 12.55c-.405.358-.656.86-.696 1.318v2.135l2.064.002c.534-.038 1.031-.287 1.43-.743L17.558 9.2l-2.755-2.755Zm1.415-1.414 2.754 2.755.894-.894a.462.462 0 0 0 0-.653L17.76 4.135a.456.456 0 0 0-.647 0l-.897.896ZM22 13v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7v2H4v16h16v-7h2ZM17.437 2c.655 0 1.283.261 1.741.723l2.101 2.101a2.462 2.462 0 0 1 0 3.482l-8.321 8.318c-.699.805-1.69 1.3-2.823 1.378H6v-1l.003-3.215c.085-1.054.576-2.035 1.323-2.694l8.37-8.368A2.456 2.456 0 0 1 17.436 2Z"
                              fillRule="evenodd"
                              fill="#111827"
                              className="fill-000000"
                            ></path>
                          </svg>
                        </div>
                        <div
                          onClick={(e) => openModal(video.id, e)}
                          className="w-7 h-7 px-[3px] py-[1px] rounded-md transition-transform transform hover:scale-105 cursor-pointer hover:bg-gray-200"
                        >
                          <svg
                            viewBox="0 0 448 512"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M432 80h-82.38l-34-56.75C306.1 8.827 291.4 0 274.6 0H173.4c-16.8 0-32.4 8.827-41 23.25L98.38 80H16C7.125 80 0 87.13 0 96v16c0 8.9 7.125 16 16 16h16v320c0 35.35 28.65 64 64 64h256c35.35 0 64-28.65 64-64V128h16c8.9 0 16-7.1 16-16V96c0-8.87-7.1-16-16-16zM171.9 50.88c1-1.75 3-2.88 5.1-2.88h94c2.125 0 4.125 1.125 5.125 2.875L293.6 80H154.4l17.5-29.12zM352 464H96c-8.837 0-16-7.163-16-16V128h288v320c0 8.8-7.2 16-16 16zm-128-48c8.844 0 16-7.156 16-16V192c0-8.844-7.156-16-16-16s-16 7.2-16 16v208c0 8.8 7.2 16 16 16zm-80 0c8.8 0 16-7.2 16-16V192c0-8.844-7.156-16-16-16s-16 7.2-16 16v208c0 8.8 7.2 16 16 16zm160 0c8.844 0 16-7.156 16-16V192c0-8.844-7.156-16-16-16s-16 7.2-16 16v208c0 8.8 7.2 16 16 16z"
                              fill="#111827"
                              className="fill-000000"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
              {isEditing && (
                <div className="flexer">
                  <button
                    onClick={() => HandleAddVideo(courseId)}
                    className="bg-gradient-to-r flexer gap-1 from-[#3B82F6] to-[#10B981] text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform"
                  >
                    <span>Add </span>
                    <img
                      className=" md:w-3 md:h-3 w-4 h-4"
                      src="plus.svg"
                      alt=""
                    />
                  </button>
                </div>
              )}
            </ul>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default CoursePlay;
