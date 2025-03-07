import { Pool, PoolClient } from "pg";

export type EmptyObject = Record<string, never>;

let pool: Pool;

export function initializePool() {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 20,
    });
}

export async function execute<T = void>(operator: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await pool.connect();
    try {
        const result = await operator(client);
        await client.query('COMMIT');
        return result;
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}
