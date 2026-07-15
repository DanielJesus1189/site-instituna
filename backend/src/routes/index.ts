import express from "express";
import FestivalController from "../controllers/festivalController";

const router = express.Router();

//Festivais
router.get("/festival", FestivalController.getFestivais);
router.get("/festival/:id", FestivalController.getFestivalById);
router.post("/festival", FestivalController.createFestival);
router.put("/festival/:id", FestivalController.updateFestival);
router.delete("/festival/:id", FestivalController.deleteFestival);

export default router;