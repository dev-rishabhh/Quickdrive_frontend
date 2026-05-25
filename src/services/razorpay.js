export function openRazorpayPopup({ subscriptionId}) {
    // console.log(subscriptionId);
    const rzp = new Razorpay({
        // key: "rzp_test_StTVj0vLAAdSBp",
        key: import.meta.env.VITE_RAZORPAY_KEY,
        description: "Upgrade storage limit",
        name: "Quickdrive",
        subscription_id: subscriptionId,
        handler: async function (response) {
            // console.log(response);
            // console.log(response.razorpay_subscription_id);
            const res = await subscriptionComplete(response.razorpay_subscription_id)
            console.log(res);
            if(res.ok){
                window.location.href = "/"
            }
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

async function subscriptionComplete( subscriptionId ) {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/subscriptions/complete`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            subscriptionId
        }),
        credentials: "include"
    })
    return res
}



