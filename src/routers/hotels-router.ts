import { Router } from "express";

import { getHotels, getHotelRooms } from "@/controllers/hotels-controller";
import { authenticateToken } from "@/middlewares";

const hotelsRouter = Router();

hotelsRouter
    .all('/*', authenticateToken)
    .get('/', getHotels)
    .post('/', getHotelRooms);

export { hotelsRouter };