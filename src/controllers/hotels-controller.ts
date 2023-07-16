import { Request, Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import * as hotelService from "@/services/hotels-service";
import httpStatus from 'http-status';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;

    const hotels = await hotelService.getHotels(userId);
    try{
        await hotelService.validate(userId);
    }catch(error){
        res.status(httpStatus.PAYMENT_REQUIRED).send(error.message);
    }
    
    res.send(hotels);
}

export async function getHotelRooms(req: AuthenticatedRequest, res: Response) {

}