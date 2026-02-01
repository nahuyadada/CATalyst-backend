import express from "express";
import { startSummarizerController } from "./summarizer.controller.js";
const router = express.Router();

router.post("/:group_id", startSummarizerController);
// router.get("/:group_id", fetchExtractorDataByGroupIdController);

export default router;
