import express from "express";
import AuthController from "../controllers/authController";
import FestivalController, { uploadCartaz } from "../controllers/festivalController";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

// Autenticação
router.post("/auth/login", AuthController.login);
router.get("/auth/me", requireAuth, AuthController.me);

// Festivais (leitura pública, escrita autenticada)
router.get("/festival", FestivalController.getFestivais);
router.get("/festival/:id", FestivalController.getFestivalById);
router.get("/festival/:id/cartaz", FestivalController.getCartaz);
router.post("/festival", requireAuth, uploadCartaz, FestivalController.createFestival);
router.put("/festival/:id", requireAuth, uploadCartaz, FestivalController.updateFestival);
router.delete("/festival/:id", requireAuth, FestivalController.deleteFestival);

export default router;