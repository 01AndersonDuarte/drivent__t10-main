import { Router } from "express";

import * as ticketsController from "@/controllers/tickets-controller";
import { authenticateToken } from "../middlewares";

const ticketsRouter = Router();

ticketsRouter
    .all('/*', authenticateToken)
    .get("/types", ticketsController.getAllTickets)
    .get("/", ticketsController.getTicket)
    .post("/", ticketsController.postTicket);

export { ticketsRouter };