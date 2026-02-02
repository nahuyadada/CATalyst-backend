import { triggerSummarizerWorkflow, insertSummarizerRepo, getSummaryByGroupIdRepo } from "./summarizer.repository.js";
// import { fetchExtractedDataUsingGroupIdService } from "../extractor/extractor.service.js";  
import { getExtractedDataByIdRepo } from "../extractor/extractor.repository.js";
export async function runSummarizerService(data) {
  if (!data) {
    return { status: 400, message: "Data is required" };
  }

  try {
    const extractedData = await getExtractedDataByIdRepo(data.id);

    if (!extractedData) {
      return { status: 404, message: "No extracted data found for the given ID" };
    }

    const finalExtractedData = {
      title: extractedData.title,
      abstract: extractedData.abstract,
      introduction: extractedData.introduction,
      literature_review: extractedData.literature_review,
      methodology: extractedData.methodology,
      discussion: extractedData.discussion,
      results: extractedData.results,
      conclusion: extractedData.conclusion,
    };

    const n8nResult = await triggerSummarizerWorkflow(finalExtractedData);

    // console.log("mapped result", n8nResult)
    const mappedResult = mapSummarizerResult(n8nResult,extractedData.title);
    console.log("group id: ",data.groupId)
    // group id should come from request, hardcoding is temporary
    const insertedData = await insertSummarizerRepo(
    //   data.group_id,
      "a2febd0e-d1c2-471d-895a-670e856e8323",
      mappedResult
    );

    return {
      status: 200,
      message: "Summarizer workflow completed",
      data: insertedData,
    };
  } catch (err) {
    console.error("Service error:", err);
    return {
      status: 500,
      message: "Failed to trigger workflow: " + err.message,
    };
  }
}

export async function fetchSummarizedDataUsingGroupIdService(group_id) {
  console.log("test: ",group_id)
    try {
        const data = await getSummaryByGroupIdRepo(group_id);
        if (!data || data.length === 0) {
            return { status: 404, message: "No data found for the given group ID" };
        }
        return { status: 200, message: "Data retrieved successfully", data: data };
    } catch (err) {
        console.error("Service error:", err);
        return { status: 500, message: "Failed to retrieve data: " + err.message };
    }
}
function mapSummarizerResult(n8nArray, title) {
    console.log("title:",title)
  return {
    title,
    introduction:      n8nArray[0]?.value ?? "not found",
    literature_review: n8nArray[1]?.value ?? "not found",
    methodology:       n8nArray[2]?.value ?? "not found",
    discussion:        n8nArray[3]?.value ?? "not found",
    results:           n8nArray[4]?.value ?? "not found",
    conclusion:        n8nArray[5]?.value ?? "not found",
  };
}

export async function fetchSummaryDataByGroupIdService(group_id){
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
