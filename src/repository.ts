import { PoolClient } from 'pg';
import { Event, Review } from './models';

export async function storeEvent(client: PoolClient, event: Event): Promise<void> {
    await client.query(
        `INSERT INTO event (region_id, event_id, secret_token, site_id, device_id, created_at)
           VALUES ($1, $2, $3, $4, $5, NOW())`,
        [event.regionId, event.eventId, event.secretToken, event.siteId, event.deviceId]
    );
}

export async function assignEvents(
    client: PoolClient,
    userId: string,
    limit: number,
    expirationInSeconds: number
): Promise<Event[]> {
    const result1 = await client.query(
        `SELECT team_id
           FROM "user"
           WHERE email = $1`,
        [userId]
    );
    const teamId = result1.rows[0]?.team_id;
    if (!teamId) {
        return [];
    }

    const result2 = await client.query(
        `SELECT region_id,
                event_id,
                secret_token,
                site_id,
                device_id,
                created_at,
                find_rule($2, region_id, site_id, device_id)
           FROM event
           WHERE review IS NULL AND
                 COALESCE(assigned_at, '1900-01-01' :: DATE) + MAKE_INTERVAL(secs => $1) < NOW() AND
                 find_rule($2, region_id, site_id, device_id) IS NOT NULL
           ORDER BY region_id, event_id
           LIMIT $3
           FOR UPDATE
           SKIP LOCKED`,
        [expirationInSeconds, teamId, limit]
    );
    for (const row of result2.rows) {
        await client.query(
            `UPDATE event
               SET assigned_at = NOW(),
                   assigned_to = $1,
                   rule_id = $2
               WHERE region_id = $3 AND
                     event_id = $4`,
            [userId, row.rule_id, row.region_id, row.event_id]
        );
    }

    return result2.rows.map(record => ({
        regionId: record.region_id,
        eventId: record.event_id,
        secretToken: record.secretToken,
        siteId: record.site_id,
        deviceId: record.device_id,
        createdAt: record.created_at
    }));
}

export async function reviewEvent(
    client: PoolClient,
    regionId: string,
    eventId: string,
    review: Review
): Promise<void> {
    await client.query(
        `UPDATE event
           SET review = $1,
               reviewed_at = NOW()
           WHERE region_id = $2 AND
                 event_id = $3`,
        [review, regionId, eventId]
    );
}
