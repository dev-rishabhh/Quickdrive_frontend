

export async function verifyIdToken(credential) {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/google/callback`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ code: credential }),
        credentials:"include"
    })
    const data =await res.json()
    return data

} 