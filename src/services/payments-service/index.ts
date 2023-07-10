import * as paymentsRepository from "@/repositories/payments-repository";
import * as ticketsRepository from "@/repositories/tickets-repository";
import { cannotEnrollBeforeStartDateError, notFoundError, unauthorizedError } from "@/errors";
import { BodyPayment, DataPayment } from "@/protocols";
import { upTicket } from "../../repositories/tickets-repository";
import { TicketStatus } from "@prisma/client";
import { prisma } from "@/config";

export async function getPayment(ticketId: number, userId: number) {
    if (isNaN(ticketId)) throw cannotEnrollBeforeStartDateError();
    const result = await paymentsRepository.getPayment(ticketId);
    const userIdPayment = await getUserIdPayment(ticketId);

    if (!result) throw notFoundError();

    if (userId !== userIdPayment.Enrollment.userId) throw unauthorizedError();

    return result;
}

export async function getUserIdPayment(ticketId: number) {
    return await paymentsRepository.getUserIdPayment(ticketId);
}
export async function postPayment(payment: BodyPayment, userId: number) {
    if(isNaN(payment.ticketId)) throw cannotEnrollBeforeStartDateError();
    if(!payment.cardData) throw cannotEnrollBeforeStartDateError();

    const userIdPayment = await getUserIdPayment(payment.ticketId);
    const status: TicketStatus = "PAID";

    const ticket = await prisma.ticket.findFirst({where: {id: payment.ticketId}});
    if (!ticket) throw notFoundError();

    if (userId !== userIdPayment.Enrollment.userId) throw unauthorizedError();

    const dataPayment: DataPayment =
    {
        ticketId: payment.ticketId,
        value: userIdPayment.TicketType.price,
        cardIssuer: payment.cardData.issuer,
        cardLastDigits: `${payment.cardData.number}`.slice(-4),
    };

    await paymentsRepository.postPayment(dataPayment);
    await upTicket(payment.ticketId, userIdPayment.TicketType.id, status);
    return await getPayment(payment.ticketId, userId);
}