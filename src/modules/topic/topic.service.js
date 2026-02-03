import { triggerTopicSuggesterWorkflow } from "./topic.repository.js";
export async function runTopicSuggesterService(data){
    console.log(data);
    if(!data){
        return { status: 400, message: "Data is required"};
    }
    // return { status: 400, message: "Data is required"};
    try{
        const gapResult = await triggerTopicSuggesterWorkflow(data.gaps);
        
       
        console.log(gapResult)
        return {
            status: 200,
            message: "Topic service completed",
            data: gapResult,
        };
    }catch(err){
        console.error("Service error: ",err);
        return {
        status: 500,
        message: "Failed to trigger workflow: " + err.message,
        };        
    }

}