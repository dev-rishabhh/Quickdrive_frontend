import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DirectoryHeader from "./components/DirectoryHeader";
import CreateDirectoryModal from "./components/CreateDirectoryModal";
import RenameModal from "./components/RenameModal";
import DetailsModal from "./components/DetailsModal";
import DirectoryList from "./components/DirectoryList";
import "./DirectoryView.css";
import { uploadComplete, uploadInitiate } from "./services/s3.js";

function DirectoryView() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const { dirId } = useParams();
  const navigate = useNavigate();

  // Error state
  const [errorMessage, setErrorMessage] = useState("");

  // Displayed directory name
  const [directoryName, setDirectoryName] = useState("My Drive");

  // Lists of items
  const [directoriesList, setDirectoriesList] = useState([]);
  const [filesList, setFilesList] = useState([]);

  // Modal states
  const [showCreateDirModal, setShowCreateDirModal] = useState(false);
  const [newDirname, setNewDirname] = useState("New Folder");

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameType, setRenameType] = useState(null); // "directory" or "file"
  const [renameId, setRenameId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [details, setDetails] = useState("");

  // Uploading states
  const fileInputRef = useRef(null);

  const [uploadItem, setUploadItem] = useState(null); // { id, file, name, size, progress, isUploading }
  const xhrRef = useRef(null);

  // Context menu
  const [activeContextMenu, setActiveContextMenu] = useState(null);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });

  // User
  const [usedStorageinBytes, setusedStorageinBytes] = useState(0);
  const [maxStorageinBytes, setmaxStorageinBytes] = useState(0);

  /**
   * Fetch directory contents
   */
  async function getDirectoryItems() {
    setErrorMessage(""); // clear any existing error
    try {
      const response = await fetch(`${BASE_URL}/directory/${dirId || ""}`, {
        credentials: "include"
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      await handleFetchErrors(response);
      const data = await response.json();
      // console.log(data._doc.name);


      // Set directory name
      if (data._doc.name) {
        setDirectoryName(dirId ? data._doc.name : "My Drive");
      } else {
        setDirectoryName("My Drive");
      }

      // Reverse the directories and files so new items are on top
      const reversedDirs = [...data.directories].reverse();
      const reversedFiles = [...data.files].reverse();
      setDirectoriesList(reversedDirs);
      setFilesList(reversedFiles);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  useEffect(() => {
    getDirectoryItems();
    // Reset context menu
    setActiveContextMenu(null);
  }, [dirId]);

  // -------------------------------------------
  // 1. Fetch user info from /user on mount
  // -------------------------------------------
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(`${BASE_URL}/user`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          // Set user info if logged in
          setusedStorageinBytes(data.usedStorageinBytes)
          setmaxStorageinBytes(data.maxStorageinBytes)
        } else if (response.status === 413) {
          // Payload too large
          setErrorMessage("File size is larger than space available. Please upgrade to you storage limit");
        } else {
          // Handle other error statuses if needed
          console.error("Error fetching user info:", response.status);
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    }
    fetchUser();
  }, [BASE_URL]);

  /**
   * Decide file icon
   */
  function getFileIcon(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf":
        return "pdf";
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return "image";
      case "mp4":
      case "mov":
      case "avi":
        return "video";
      case "zip":
      case "rar":
      case "tar":
      case "gz":
        return "archive";
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
      case "html":
      case "css":
      case "py":
      case "java":
        return "code";
      default:
        return "alt";
    }
  }

  /**
   * Click row to open directory or file
   */
  function handleRowClick(type, id) {
    if (type === "directory") {
      navigate(`/directory/${id}`);
    } else {
      window.location.href = `${BASE_URL}/file/${id}`;
    }
  }

  /**
   * Select multiple files
   */
  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (uploadItem?.isUploading) {
      setErrorMessage("An upload is already in progress. Please wait.");
      setTimeout(() => setErrorMessage(""), 3000);
      e.target.value = "";
      return;
    }

    const tempItem = {
      file,
      name: file.name,
      size: file.size,
      id: `temp-${Date.now()}`,
      isUploading: true,
      progress: 0,
    };

    setFilesList((prev) => [tempItem, ...prev]);
    setUploadItem(tempItem);
    e.target.value = "";


    try {
      const res = await uploadInitiate({
        name: file.name,
        size: file.size,
        contentType: file.type,
        parentDirId: dirId
      })

      if (res.status === 413) {
        setErrorMessage("File size is excedding max limit");
        setFilesList((prev) => prev.filter((f) => f.name !== file.name ));
        setUploadItem(null);
        setTimeout(() => setErrorMessage(""), 3000);
      }

      const { fileId, url } = await res.json()

      startUpload(tempItem, fileId, url);

    } catch (error) {
      console.log(error);
      setErrorMessage("Something went wrong!");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  }

  /**
   * Upload item
   */

  function startUpload(item, fileId, url) {

    const totalSizeAfterAddingFileSize = usedStorageinBytes + Number(item.size)
    if (totalSizeAfterAddingFileSize > maxStorageinBytes) {
      setErrorMessage("File size is larger than space available. Please upgrade to you storage limit");
      return
    }

    // Start upload
    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    // console.log(type);


    xhr.open("PUT", url,);
    // xhr.setRequestHeader("Content-Type",type)

    xhr.upload.addEventListener("progress", (evt) => {
      if (evt.lengthComputable) {
        const progress = (evt.loaded / evt.total) * 100;
        setUploadItem((prev) => (prev ? { ...prev, progress } : prev));
      }
    });

    xhr.addEventListener("load", async () => {
      // Clear upload state and refresh directory
      try {
        await uploadComplete({ fileId })
      } catch (error) {
        setErrorMessage("File could not be uploaded!");
        setTimeout(() => setErrorMessage(""), 3000);
      }

      setUploadItem(null);
      getDirectoryItems()
    });

    // If user cancels, we also remove from the queue
    xhr.onerror = () => {
      setErrorMessage("Something went wrong!");
      // Remove temp item from the list
      setFilesList((prev) => prev.filter((f) => f.id !== item.id));
      setUploadItem(null);
      setTimeout(() => setErrorMessage(""), 3000);
    };

    xhr.send(item.file)
  }

  /**
   * Cancel an in-progress upload
   */
  function handleCancelUpload(tempId) {
    // console.log("tempid:",tempId);

    // await cancelUpload({fileId : tempId})

    if (uploadItem && uploadItem.id === tempId && xhrRef.current) {
      xhrRef.current.abort();
    }
    // Remove temp item and reset state
    setFilesList((prev) => prev.filter((f) => f.id !== tempId));
    setUploadItem(null);
  }

  /**
   * Delete a file/directory
   */
  async function handleDeleteFile(id) {
    setErrorMessage("");
    try {
      const response = await fetch(`${BASE_URL}/file/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      await handleFetchErrors(response);

      getDirectoryItems();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleDeleteDirectory(id) {
    setErrorMessage("");
    try {
      const response = await fetch(`${BASE_URL}/directory/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      await handleFetchErrors(response);

      getDirectoryItems();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  /**
   * Create a directory
   */
  async function handleCreateDirectory(e) {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await fetch(`${BASE_URL}/directory/${dirId || ""}`, {
        method: "POST",
        headers: {
          dirname: newDirname,
        },
        credentials: "include"
      });

      await handleFetchErrors(response);

      setNewDirname("New Folder");
      setShowCreateDirModal(false);
      getDirectoryItems();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  //  Details 
  function openDetailsModal(item) {
    setDetails(item)
    setShowDetailsModal(true)
  }

  /**
   * Rename
   */
  function openRenameModal(type, id, currentName) {
    setRenameType(type);
    setRenameId(id);
    setRenameValue(currentName);
    setShowRenameModal(true);
  }

  async function handleRenameSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    try {
      if (renameType === "file") {
        const response = await fetch(`${BASE_URL}/file/${renameId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newFilename: renameValue }),
          credentials: "include"
        });

        await handleFetchErrors(response);

      } else {
        const response = await fetch(`${BASE_URL}/directory/${renameId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newDirName: renameValue }),
          credentials: "include"
        });

        await handleFetchErrors(response);

      }

      setShowRenameModal(false);
      setRenameValue("");
      setRenameType(null);
      setRenameId(null);
      getDirectoryItems();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  /**
   * Context Menu
   */
  function handleContextMenu(e, id) {
    e.stopPropagation();
    e.preventDefault();
    const clickX = e.clientX;
    const clickY = e.clientY;

    if (activeContextMenu === id) {
      setActiveContextMenu(null);
    } else {
      setActiveContextMenu(id);
      setContextMenuPos({ x: clickX - 110, y: clickY });
    }
  }

  /**
  * Utility: handle fetch errors
  */
  async function handleFetchErrors(response) {
    if (!response.ok) {
      let errMsg = `Request failed with status ${response.status}`;
      try {
        const data = await response.json();
        if (data.error) errMsg = data.error;
      } catch (_) {
        // If JSON parsing fails, default errMsg stays
      }
      throw new Error(errMsg);
    }
    return response;
  }

  useEffect(() => {
    function handleDocumentClick() {
      setActiveContextMenu(null);
    }
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);
  // console.log(filesList);


  // Combine directories & files into one list for rendering
  const combinedItems = [
    ...directoriesList.map((d) => ({ ...d, isDirectory: true })),
    ...filesList.map((f) => ({ ...f, isDirectory: false })),
  ];

  // For compatibility with children expecting these values:
  const isUploading = !!uploadItem?.isUploading;
  const progressMap = uploadItem
    ? { [uploadItem.id]: uploadItem.progress || 0 }
    : {};
  // console.log(uploadItem);

  // console.log(progressMap);


  return (
    <div className="directory-view">
      {/* Top error message for general errors */}
      {errorMessage &&
        errorMessage !==
        "Directory not found or you do not have access to it!" && (
          <div className="error-message">{errorMessage}</div>
        )}
      <DirectoryHeader
        directoryName={directoryName}
        onCreateFolderClick={() => setShowCreateDirModal(true)}
        onUploadFilesClick={() => fileInputRef.current.click()}
        fileInputRef={fileInputRef}
        handleFileSelect={handleFileSelect}
        disabled={
          errorMessage ===
          "Directory not found or you do not have access to it!"
        }
      />

      {/* Create Directory Modal */}
      {showCreateDirModal && (
        <CreateDirectoryModal
          newDirname={newDirname}
          setNewDirname={setNewDirname}
          onClose={() => setShowCreateDirModal(false)}
          onCreateDirectory={handleCreateDirectory}
        />
      )}

      {/* Details Modal */}
      {showDetailsModal && (
        <DetailsModal
          item={details}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {/* Rename Modal */}
      {showRenameModal && (
        <RenameModal
          renameType={renameType}
          renameValue={renameValue}
          setRenameValue={setRenameValue}
          onClose={() => setShowRenameModal(false)}
          onRenameSubmit={handleRenameSubmit}
        />
      )}

      {combinedItems.length === 0 ? (
        // Check if the error is specifically the "no access" error
        errorMessage ===
          "Directory not found or you do not have access to it!" ? (
          <p className="no-data-message">
            Directory not found or you do not have access to it!
          </p>
        ) : (
          <p className="no-data-message">
            This folder is empty. Upload files or create a folder to see some
            data.
          </p>
        )
      ) : (
        <DirectoryList
          items={combinedItems}
          handleRowClick={handleRowClick}
          activeContextMenu={activeContextMenu}
          contextMenuPos={contextMenuPos}
          handleContextMenu={handleContextMenu}
          getFileIcon={getFileIcon}
          isUploading={isUploading}
          progressMap={progressMap}
          handleCancelUpload={handleCancelUpload}
          handleDeleteFile={handleDeleteFile}
          handleDeleteDirectory={handleDeleteDirectory}
          openRenameModal={openRenameModal}
          openDetailsModal={openDetailsModal}
          BASE_URL={BASE_URL}
        />
      )}
    </div>
  );
}

export default DirectoryView;
