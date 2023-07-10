import { Router } from "express";

import * as paymentsController from "@/controllers/payments-controller";
import { authenticateToken, validateBody } from "@/middlewares";
import { validatePaymentBody } from "@/schemas/payments-schema";

const paymentsRouter = Router();

paymentsRouter
    .all('/*', authenticateToken)
    .get("/", paymentsController.getPayment)
    .post("/process", validateBody(validatePaymentBody), paymentsController.postPayment);

export { paymentsRouter };