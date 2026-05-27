import React from "react";
import "./test.css";


const ActionButtons = () => {
  return (
    <div className="action-container">
      <button className="btn upload-btn">
        <span className="icon">⬆</span>
        Upload Files
      </button>

      <button className="btn create-btn">
        <span className="icon">📁</span>
        Create Directory
      </button>

    </div>
  );
};

export default ActionButtons;