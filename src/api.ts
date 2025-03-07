import express, { Request, Response } from "express";
import { EmptyObject, execute } from "./utils";
import { Event, Review } from './models';
import * as service from './service';

export const router = express.Router();
router.post(
    '/event',
    async (
        req: Request<EmptyObject, EmptyObject, Event>,
        res: Response<EmptyObject>
    ) => {
        await execute(async client => {
            await service.storeEvent(
                client,
                {
                    regionId: req.body.regionId,
                    eventId: req.body.eventId,
                    secretToken: req.body.secretToken,
                    siteId: req.body.siteId,
                    deviceId: req.body.deviceId,
                    createdAt: new Date(),
                }
            );
            res.send();
        });
    }
);

router.post(
    '/review',
    async (
        req: Request<EmptyObject, { events: Event[] }, { userId: string }>,
        res: Response<{ events: Event[] }>
    ) => {
        const events = await execute(async client => {
            return await service.assignEvents(client, req.body.userId);
        });
        res.send({ events });
    }
);

router.put(
    '/review/:regionId/:eventId',
    async (
        req: Request<{ regionId: string, eventId: string }, EmptyObject, { review: Review }>,
        res: Response<EmptyObject>
    ) => {
        await execute(async client => {
            await service.reviewEvent(client, req.params.regionId, req.params.eventId, req.body.review);
        });
        res.send();
    }
);
