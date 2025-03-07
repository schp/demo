import { PoolClient } from "pg";
import * as repository from "./repository";
import { Event, Review } from './models';

let batchSize: number;
let expirationInSeconds: number;

export function initializeService(): void {
    batchSize = parseInt(process.env.ASSIGNMENT_BATCH_SIZE ?? '5');
    expirationInSeconds = parseInt(process.env.ASSIGNMENT_EXPIRATION_IN_SECONDS ?? '5');
}

export async function storeEvent(client: PoolClient, event: Event): Promise<void> {
    await repository.storeEvent(client, event);
}

export async function assignEvents(client: PoolClient, userId: string): Promise<Event[]> {
    return repository.assignEvents(client, userId, batchSize, expirationInSeconds);
}

export async function reviewEvent(
    client: PoolClient,
    regionId: string,
    eventId: string,
    review: Review
): Promise<void> {
    await repository.reviewEvent(client, regionId, eventId, review);
}
