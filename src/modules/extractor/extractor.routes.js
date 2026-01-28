import express from "express";
import { startExtractorController } from "./extractor.controller.js";
const router = express.Router();

router.post("/file", startExtractorController);

export default router;
