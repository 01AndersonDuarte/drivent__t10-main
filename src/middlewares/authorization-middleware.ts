import { NextFunction, Request, Response } from 'express';
import { AuthenticatedRequest } from './authentication-middleware';
import { getUserIdPayment } from '../repositories/payments-repository';
import { cannotEnrollBeforeStartDateError, unauthorizedError } from '../errors';

export async function authorization(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req;
    const ticketId = Number(req.query.ticketId);

    const userIdPayment = await getUserIdPayment(ticketId);
    if (userId !== userIdPayment.Enrollment.userId) throw unauthorizedError();

    next();
}