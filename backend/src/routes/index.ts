import express from "express";
import FestivalController, { uploadCartaz } from "../controllers/festivalController";

const router = express.Router();

// Festivais
router.get("/festival", FestivalController.getFestivais);
router.get("/festival/:id", FestivalController.getFestivalById);
router.get("/festival/:id/cartaz", FestivalController.getCartaz);
router.post("/festival", uploadCartaz, FestivalController.createFestival);
router.put("/festival/:id", uploadCartaz, FestivalController.updateFestival);
router.delete("/festival/:id", FestivalController.deleteFestival);

export default router;