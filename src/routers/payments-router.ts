import { Router } from "express";

import * as paymentsController from "@/controllers/payments-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { validatePaymentBody } from "@/schemas/payments-schema";
import { authorization } from "../middlewares/authorization-middleware";

const paymentsRouter = Router();

paymentsRouter
    .all('/*', authenticateToken)
    .get("/", paymentsController.getPayment)
    .post("/process", paymentsController.postPayment);

export { paymentsRouter };