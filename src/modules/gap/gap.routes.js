import express from "express";
import { startGapExtractorController } from "./gap.controller.js";
const router = express.Router();

router.post("/:group_id", startGapExtractorController);
// router.get("/:group_id", );

export default router;
