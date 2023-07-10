import * as ticketsRepository from "@/repositories/tickets-repository";
import { notFoundError } from "../../errors";
import { TicketStatus } from "@prisma/client";

export async function getAllTickets() {
    const result = await ticketsRepository.getAllTickets();
    return result;
}

export async function getTicket(userId: number) {
    const enrollment = await checkEnrollment(userId);
    const ticket = await ticketsRepository.getTicket(enrollment.id);

    if(!ticket) throw notFoundError();

    return ticket;
}

async function checkEnrollment(userId: number) {
    const result = await ticketsRepository.checkEnrollment(userId);

    if(!result) throw notFoundError();
    
    return result;
}


export async function postTicket(userId: number, ticketTypeId: number) {
    const enrollment = await checkEnrollment(userId);
    const findTicket = await ticketsRepository.checkTicket(enrollment.id);
    const status: TicketStatus = 'RESERVED';

    if (!findTicket) {
        await ticketsRepository.postTicket(enrollment.id, ticketTypeId);
    }else{
        await ticketsRepository.upTicket(findTicket.id, ticketTypeId, status);
    }

    return await getTicket(userId);
}