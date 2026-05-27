import "./CreateDirectory.css";
import { FaFolderPlus, FaSignInAlt, FaSignOutAlt, FaUpload, FaUser } from "react-icons/fa";

function CreateDirectory({
    directoryName,
    onCreateFolderClick,
    onUploadFilesClick,
    handleFileSelect,
    fileInputRef,
}) {
    return (
        <div className="content-wrapper">
            <div className="directory-card">
                <h3>{directoryName}</h3>
                {/* {console.log(directoryName)} */}
                <div className="features-list">
                    <div className="actions-container">
                        {/* Create Folder (icon button) */}
                        <button
                            className="btn create-btn"
                            title="Create Folder"

                            onClick={onCreateFolderClick}
                        // disabled={disabled}
                        >
                            <span className="icon"><FaFolderPlus /></span>
                            Create Directory
                        </button>

                        {/* Upload Files (icon button) */}
                        <button
                            className="btn upload-btn"
                            title="Upload Files"
                            onClick={onUploadFilesClick}
                        // disabled={disabled}
                        >
                            <span className="icon"><FaUpload /></span>
                            Upload Files

                        </button>

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            id="file-upload"
                            type="file"
                            style={{ display: "none" }}
                            multiple
                            onChange={handleFileSelect}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateDirectory