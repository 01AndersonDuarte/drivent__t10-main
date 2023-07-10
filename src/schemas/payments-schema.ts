import Joi from "joi";
import { BodyPayment } from "../protocols";

export const validatePaymentBody = Joi.object<BodyPayment>({
    ticketId: Joi.number().integer().required(),
    cardData: Joi.object({
        issuer: Joi.string().required(),
        number: Joi.number().integer().required(),
        name: Joi.string().required(),
        expirationDate: Joi.date().required(),
        cvv: Joi.number().integer().required()
    })
});