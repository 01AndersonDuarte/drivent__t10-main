import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares";
import * as ticketsService from "@/services/tickets-service"
import httpStatus from "http-status";

export async function getAllTickets(req: AuthenticatedRequest, res: Response) {
    const result = await ticketsService.getAllTickets();
    res.send(result);
}

export async function getTicket(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const result = await ticketsService.getTicket(userId);
}

export async function postTicket(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { ticketTypeId } = req.body as Record<string, number>;

    const result = await ticketsService.postTicket(userId, ticketTypeId);
    res.status(httpStatus.CREATED).send(result);
}