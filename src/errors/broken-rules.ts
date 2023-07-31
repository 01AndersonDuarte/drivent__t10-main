import { ApplicationError } from "../protocols";

export function bookingRulesBreaksError(): ApplicationError {
    return {
        name: 'brokenRules',
        message: 'You must review your ticket purchase'
    };
}

