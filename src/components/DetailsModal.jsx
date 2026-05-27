import { useEffect, useRef } from "react";
import { fileSize } from "../services/fileSize.js";
import "./DetailsModal.css"
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
        <h2>Details</h2>
        <div className="detail">
          <p className="detail-type">Name</p>
          <p className="detail-value">{item.name}</p>
        </div>
        <div className="detail">
          <p className="detail-type">Size</p>
          <p className="detail-value">{fileSize(item.size)}</p>
        </div>
         <div className="detail">
          <p className="detail-type">Created At </p>
          <p className="detail-value">{new Date(item.createdAt).toLocaleString()}</p>
        </div>
         <div className="detail">
          <p className="detail-type">Updated At </p>
          <p className="detail-value">{new Date(item.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export default DetailsModal;


