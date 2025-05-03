// Smooth scroll to top utility
const ScrollTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};


const GetDuration = (duration: number) => {
  if (!duration) return "0s"; // Handle missing or falsy duration
  
  const truncatedDuration = Math.trunc(duration); // Truncate to integer
  
  if (truncatedDuration >= 3600) {
    const hours = Math.floor(truncatedDuration / 3600);
    const minutes = Math.floor((truncatedDuration % 3600) / 60);
    const seconds = truncatedDuration % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (truncatedDuration >= 60) {
    const minutes = Math.floor(truncatedDuration / 60);
    const seconds = truncatedDuration % 60;
    return `${minutes}m ${seconds}s`;
  } else {
    return `${truncatedDuration}s`;
  }
};
export { ScrollTop, GetDuration };