import express from "express";
import { startTopicSuggesterController } from "./topic.controller.js";
const router = express.Router();

router.post("/run", startTopicSuggesterController);
// router.get("/:group_id", );

export default router;
