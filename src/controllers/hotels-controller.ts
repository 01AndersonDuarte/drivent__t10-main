import { Request, Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import * as hotelService from "@/services/hotels-service";
import httpStatus from 'http-status';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;

    try {
        const hotels = await hotelService.getHotels(userId);
        if (hotels.length === 0) return res.sendStatus(httpStatus.NOT_FOUND);

        res.send(hotels);
    } catch (err) {
        if (err.name === 'NotFoundError') {
            return res.status(httpStatus.NOT_FOUND).send({
                message: err.message,
            });
        }

        if (err.name === 'PaymentRequired') {
            return res.status(httpStatus.PAYMENT_REQUIRED).send({
                message: err.message,
            });
        }
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
}

export async function getHotelRooms(req: AuthenticatedRequest, res: Response) {
    const hotelId = Number(req.params.hotelId);
    const { userId } = req;

    const hotelRooms = await hotelService.getHotelRooms(hotelId, userId);

    res.send(hotelRooms);
}