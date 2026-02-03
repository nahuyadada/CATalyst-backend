import fetch from 'node-fetch'
import supabase from "../../common/config/supabaseClient.js";

export async function triggerTopicSuggesterWorkflow(data) {
    const webhookUrl = process.env.N8N_TOPIC_TEST_WEBHOOK_URL;

    const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to trigger workflow: ${res.status} - ${errorText}`);
    }
    const result = await res.json();
    return result

}