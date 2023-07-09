import * as ticketsRepository from "@/repositories/tickets-repository";

export async function getAllTickets() {
    const result = await ticketsRepository.getAllTickets();
    return result;
}

export async function getTicket(userId: number) {
    return await ticketsRepository.getTicket(userId);
}

export async function postTicket(userId: number, ticketTypeId: number) {
    await ticketsRepository.postTicket(userId, ticketTypeId);
    return await getTicket(userId);
}