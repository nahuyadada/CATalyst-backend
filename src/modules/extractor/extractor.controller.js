import multer from "multer";
import { runExtractorService } from "./extractor.service.js";

const upload = multer({ storage: multer.memoryStorage() });

export const startExtractorController = [
  upload.single("file"), 
  async (req, res, next) => {
    try {
      console.log("req.file:", req);
      const file = req.file?.buffer;
      const filename = req.file?.originalname;
      
      console.log("Received file:", filename);
      const result = await runExtractorService(file, filename);

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
  },
];
