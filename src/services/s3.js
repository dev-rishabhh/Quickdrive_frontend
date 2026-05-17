
export async function uploadInitiate({ name, size, contentType, parentDirId }) {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/file/upload/initiate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            size,
            contentType,
            parentDirId
        }),
        credentials: "include"
    })

    return res
}

export async function uploadComplete({ fileId }) {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/file/upload/complete`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fileId
        }),
        credentials: "include"
    })

    const data = await res.json()
    return data
}
// export async function cancelUpload({ fileId }) {
//     const res = await fetch(`${import.meta.env.VITE_BASE_URL}/file/upload/cancel`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             fileId
//         }),
//         credentials: "include"
//     })

//     const data = await res.json()
//     return data
// }