import express from "express";
import multer from "multer";
import { uploadCsv } from "../controllers/uploadCsv.controller.js";
import { verifyToken } from "../middleware/auth.js";
import { verifyRole } from "../middleware/role.js";

const router = express.Router();
const upload = multer({ dest: "tmp/uploads/" });

router.post(
  "/upload",
  verifyToken,
  verifyRole("ADMIN"),
  upload.single("file"),
  uploadCsv
);

export default router;
