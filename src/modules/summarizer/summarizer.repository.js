import fetch from "node-fetch";

export async function triggerSummarizerWorkflow(data) {
    const webhookUrl = process.env.N8N_SUMMARIZER_WEBHOOK_URL;
    // console.log("this is data in repo:", data);

    const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    console.log("Response status:", res.status);
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to trigger workflow: ${res.status} - ${errorText}`);
    }
    const result = await res.json();
    return result

}