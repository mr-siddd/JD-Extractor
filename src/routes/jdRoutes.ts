import { Router } from "express";
import { extractJDController, saveManualJDController } from "../controllers/extractJDController";

const router = Router();

router.post("/extract-jd", extractJDController);
router.post("/save-manual-jd", saveManualJDController);

export default router;
