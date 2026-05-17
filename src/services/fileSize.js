export function fileSize(size) {
    const KB = 1024
    const MB = KB * 1024
    const GB = MB * 1024

    if (size >= KB && size < MB) return (size / KB).toFixed(2) + " " + "KB"
    if (size >= MB && size < GB) return (size / MB).toFixed(2) + " " + "MB"
    if (size >= GB) return (size / GB).toFixed(2) + " " + "GB"

    return size + " " + "B"
}