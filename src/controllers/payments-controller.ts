import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares";
import httpStatus from "http-status";
import * as servicePayments from "@/services/payments-service";
import { cannotEnrollBeforeStartDateError } from "../errors";
import { BodyPayment } from "../protocols";

export async function getPayment(req: AuthenticatedRequest, res: Response) {
    const ticketId = Number(req.query.ticketId);
    if (!ticketId) throw cannotEnrollBeforeStartDateError();

    const result = await servicePayments.getPayment(ticketId, req.userId);

    res.send(result);
}
export async function postPayment(req: AuthenticatedRequest, res: Response) {
    const payment = req.body as BodyPayment;

    const result = await servicePayments.postPayment(payment, req.userId);

    res.send(result);
}
