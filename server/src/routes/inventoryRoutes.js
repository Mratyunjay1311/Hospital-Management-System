import express from "express";
import { getInventory, createItem, updateItem, deleteItem, getAlerts } from "../controllers/inventoryController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.route("/")
  .get(getInventory)
  .post(createItem);

router.get("/alerts", getAlerts);

router.route("/:id")
  .put(updateItem)
  .delete(deleteItem);

export default router;
