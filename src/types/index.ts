export * from './config';
export * from './message';

export interface SimpleClient {
    name?: string;
    uuid?: string;
    SID?: number;
}

export const PacketVersion = 4;
