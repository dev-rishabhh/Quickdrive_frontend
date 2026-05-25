
export function openRazorpayPopup({ subscriptionId }) {
    // console.log(subscriptionId);

    const rzp = new Razorpay({
        // key: "rzp_test_StTVj0vLAAdSBp",
        key: import.meta.env.VITE_VITE_RAZORPAY_KEY,
        description: "Upgrade storage limit",
        name: "Quickdrive",
        subscription_id: subscriptionId,
        handler: async function (response) {
            console.log(response);
        },
    });

    rzp.on("payment.failed", function (response) {
        console.log(response);
    });

    rzp.open();
}


export async function subscriptionInitiate({ planId }) {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/subscriptions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            planId
        }),
        credentials: "include"
    })

    const data = await res.json()
    return data
}



