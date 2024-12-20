import express from "express"
import protect from "../middlewares/authMiddleware.js"
import { allMessages, sendMessage } from "../controllers/messageControllers.js"


const router = express.Router()

router.post("/", protect,sendMessage) // protect
router.get("/:chatId", protect,allMessages)

export default router;