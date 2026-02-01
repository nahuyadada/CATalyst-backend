import { triggerSummarizerWorkflow } from "./summarizer.repository.js";
import { fetchExtractedDataUsingGroupIdService } from "../extractor/extractor.service.js";  
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
            keywords: extractedData.keywords,
        };

        const result = await triggerSummarizerWorkflow(finalExtractedData);
        // console.log("Service received result:", result);
        return { status: 200, message: "Workflow triggered successfully", data: result || null };
    } catch (err) {
        console.error("Service error:", err);
        return { status: 500, message: "Failed to trigger workflow: " + err.message };
    }
}
export async function fetchSummarizedDataUsingGroupIdService(groupId) {
    try {
        const data = await fetchExtractedDataUsingGroupIdService(groupId);
        if (!data || data.length === 0) {
            return { status: 404, message: "No data found for the given group ID" };
        }
        return { status: 200, message: "Data retrieved successfully", data: data };
    } catch (err) {
        console.error("Service error:", err);
        return { status: 500, message: "Failed to retrieve data: " + err.message };
    }
}