import { runSummarizerService } from "./summarizer.service.js";

export async function startSummarizerController(req, res, next) {
    try {
        const data = req.body;
        const result = await runSummarizerService(data);
        return res.status(result.status).json({
            success: result.status < 400,
            message: result.message,
            data: result.data || null,
        });
    } catch (err) {
        console.error("Controller error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }   

    
}