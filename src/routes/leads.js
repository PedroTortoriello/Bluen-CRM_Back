import { Router } from "express";
import { getLeads, getLeadById, createLead, updateLead, deleteLead } from "../controllers/leads-controllers.js";

const router = Router();

router.get("/", getLeads);
router.get("/:id", getLeadById);
router.post("/", createLead);
router.patch("/numero/:numero", updateLead);
router.delete("/:id", deleteLead);

export default router;
