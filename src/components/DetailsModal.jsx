import { useEffect, useRef } from "react";
import { fileSize } from "../services/fileSize.js";

function DetailsModal({ item, onClose }) {

  useEffect(() => {
    // console.log(item);

    // Listen for "Escape" key to close the modal
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup keydown event listener on unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Close when clicking outside the modal content
  const handleOverlayClick = () => {
    onClose();
  };
  // console.log(fileSize(5*1024*1024*1024));

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <h2 className="center">Details</h2>
        <p>Name : {item.name} </p>
        <p>Path : </p>
        <p>Size : {fileSize(item.size)}</p>
        <p>Created At  : {new Date(item.createdAt).toLocaleString()}</p>
        <p>Updated At  : {new Date(item.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
}

export default DetailsModal;


