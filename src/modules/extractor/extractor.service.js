import { triggerExtractorWorkflow, insertExtractorRepo, getExtractorDataByGroupIdRepo } from "./extractor.repository.js";

export async function runExtractorService(file, filename) {
  if (!file) {
    return { status: 400, message: "File is required" };
  }

  try {
    const result = await triggerExtractorWorkflow(file, filename);
    const insertedData = await insertExtractorRepo("a2febd0e-d1c2-471d-895a-670e856e8323",result[0]);
    console.log("Service received result:", result[0]);
    return { status: 200, message: "Workflow triggered successfully", data: result[0] || null };
  } catch (err) {
    console.error("Service error:", err);
    return { status: 500, message: "Failed to trigger workflow: " + err.message };
  }
}
export async function fetchExtractedDataUsingGroupIdService(groupId) {
  try {
    const data = await getExtractorDataByGroupIdRepo(groupId);
    if (!data || data.length === 0) {
      return { status: 404, message: "No data found for the given group ID" };
    }
    return { status: 200, message: "Data retrieved successfully", data: data };
  } catch (err) {
    console.error("Service error:", err);
    return { status: 500, message: "Failed to retrieve data: " + err.message };
  }   
}
