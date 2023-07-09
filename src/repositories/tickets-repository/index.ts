import { prisma } from "@/config";
import { Ticket } from "@prisma/client";

export async function getAllTickets() {
    return await prisma.ticketType.findMany();
}

export async function getTicket(id: number) {
    const result = await prisma.ticket.findFirst({
        where: { enrollmentId: id },
        include: {
            TicketType: {}
        }
    });
    
    return result;
}

export async function checkEnrollment(userId: number) {
    const result = await prisma.enrollment.findFirst({
        where: { userId },
        select: {
            id: true
        }
    });
    return result;
}

export async function postTicket(id: number, ticketTypeId: number) {
    // const { id } = await checkEnrollment(userId);

    const findTicket = await prisma.ticket.findFirst({
        where: {
            enrollmentId: id
        }
    });
    if (!findTicket) {
        await prisma.ticket.create({
            data: {
                enrollmentId: id,
                ticketTypeId,
                status: 'RESERVED'
            }
        });
    } else {
        await prisma.ticket.update({
            where: {
                id: findTicket.id
            },
            data: {
                ticketTypeId,
                status: 'RESERVED'
            }
        });
    }
    return;
}