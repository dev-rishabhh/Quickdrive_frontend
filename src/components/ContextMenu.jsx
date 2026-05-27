import { FaEdit } from "react-icons/fa";
import { MdDelete, MdDetails, MdDownload } from "react-icons/md";

function ContextMenu({
  item,
  contextMenuPos,
  isUploadingItem,
  handleCancelUpload,
  handleDeleteFile,
  handleDeleteDirectory,
  openRenameModal,
  openDetailsModal,
  BASE_URL,
}) {
  // Directory context menu
  if (item.isDirectory) {
    return (
      <div
        className="context-menu"
        style={{ top: contextMenuPos.y, left: contextMenuPos.x }}
      >
        <div
          className="context-menu-item"
          onClick={() => openDetailsModal(item)}
        >
         <MdDetails/> Details
        </div>
        
        <div
          className="context-menu-item"
          onClick={() => openRenameModal("directory", item.id, item.name)}
        >
          <FaEdit/> Rename
        </div>
        <div
          className="context-menu-item"
          onClick={() => handleDeleteDirectory(item.id)}
        >
        <MdDelete/> Delete
        </div>
      </div>
    );
  } else {
    // File context menu
    if (isUploadingItem && item.isUploading) {
      // Only show "Cancel"
      return (
        <div
          className="context-menu"
          style={{ top: contextMenuPos.y, left: contextMenuPos.x }}
        >
          <div
            className="context-menu-item"
            onClick={() => handleCancelUpload(item.id)}
          >
            Cancel
          </div>
        </div>
      );
    } else {
      // Normal file
      return (
        <div
          className="context-menu"
          style={{ top: contextMenuPos.y, left: contextMenuPos.x }}
        >
          <div
            className="context-menu-item"
            onClick={() => openDetailsModal(item)}
          >
           <MdDetails/> Details
          </div>
          <div
            className="context-menu-item"
            onClick={() =>
              (window.location.href = `${BASE_URL}/file/${item.id}?action=download`)
            }
          >
           <MdDownload/> Download
          </div>
          <div
            className="context-menu-item"
            onClick={() => openRenameModal("file", item.id, item.name)}
          >
           <FaEdit/>  Rename
          </div>
          <div
            className="context-menu-item"
            onClick={() => handleDeleteFile(item.id)}
          >
            <MdDelete/> Delete
          </div>
        </div>
      );
    }
  }
}

export default ContextMenu;
