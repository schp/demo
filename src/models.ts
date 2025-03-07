type valueof<T> = T[keyof T];

export const eReview = Object.freeze({
    Approve: 'approve',
    Disapprove: 'disapprove',
    NotSure: 'not-sure',
});
export type Review = valueof<typeof eReview>;

export type Event = {
    regionId: string;
    eventId: number;
    secretToken: string;
    siteId: string;
    deviceId: string;
    createdAt: Date;
    assignedAt?: Date;
    ruleId?: number;
    assignedTo?: string;
    review?: Review;
    reviewedAt?: Date;
};

export type User = {
    email: string;
    name: string;
    password: string;
    teamId: number;
    createdAt: Date;
    deletedAt?: Date;
};

export type Team = {
    id: number;
    name: string;
    createdAt: Date;
    deletedAt?: Date;
};

export type Rule = {
    id: number;
    teamId: number;
    regionId?: string;
    siteId?: string;
    deviceId?: string;
    createdAt: Date;
    deletedAt?: Date;
};
