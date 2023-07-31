import { Request, Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import * as bookingService from "@/services/bookings-service";
import httpStatus from 'http-status';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const booking = await bookingService.getBooking(userId);

    res.send(booking);
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
    const roomId = Number(req.body.roomId);
    const { userId } = req;

    const { id } = await bookingService.postBooking(userId, roomId);

    res.send({ bookingId: id });
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
    const bookingId = Number(req.params.bookingId);
    const roomId = Number(req.body.roomId);
    const { userId } = req;

    const { id } = await bookingService.putBooking(bookingId, roomId, userId);

    res.send({ bookingId: id });
}