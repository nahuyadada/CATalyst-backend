import fetch from "node-fetch";
import FormData from "form-data";
import supabase from "../../common/config/supabaseClient.js";

/**
 * Trigger n8n workflow with a file
 * @param {Buffer|Stream} file - uploaded file
 * @param {string} filename - original file name
 */
export async function triggerExtractorWorkflow(file, filename) {
  // const webhookUrl = process.env.N8N_EXTRACTOR_WEBHOOK;
  const webhookUrl = process.env.N8N_EXTRACTOR_TEST_WEBHOOK;
  console.log("Triggering extractor workflow:", webhookUrl, filename);

  try {
    const formData = new FormData();
    formData.append("file", file, filename);

    const res = await fetch(webhookUrl, {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(), // multipart/form-data headers
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`n8n webhook failed: ${res.status} ${text}`);
    }

    const data = await res.json(); // optional if workflow returns JSON
    // console.log("n8n workflow response:", data);
    return data;
  } catch (err) {
    console.error("Workflow repo error:", err);
    throw err; // propagate system-level error
  }
}

export async function insertExtractorRepo(groupId, extractedData) {
  try {
    const {
      title,
      abstract,
      introduction,
      methodology,
      discussion,
      results,
      conclusion,
      keywords,
    } = extractedData;

    // special mapping for the weird key
    const literature_review = extractedData["literature review"];

    const { data, error } = await supabase
      .from("Extractor")
      .insert([
        {
          group_id: groupId,
          title,
          abstract,
          introduction,
          literature_review,  // clean DB column
          methodology,
          discussion,
          results,
          conclusion,
          keywords,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error("Failed to insert extractor result: " + error.message);
    }

    return data;
  } catch (err) {
    console.error("Extractor Repo Error:", err);
    throw err;
  }
}

export async function getExtractorDataByGroupIdRepo(groupId) {
  try {
    const { data, error } = await supabase
      .from("Extractor")
      .select("*")
      .eq("group_id", groupId)
      
    if (error) {
      throw new Error("Extractor data not found for group: " + error.message);
    }
    return data;
  } catch (err) {
    console.error("Get Extractor Repo Error:", err);
    throw err;
  }
}
export async function getExtractedDataByIdRepo(id) {
  try {
    const { data, error } = await supabase
      .from("Extractor")
      .select("*")
      .eq("id", id)
      .single();  
    if (error) {
      throw new Error("Extractor data not found for id: " + error.message);
    }
    return data;
  }
  catch (err) {
    console.error("Get Extractor by ID Repo Error:", err);
    throw err;
  }
}
