import {User} from "@/model/user";

export interface BeReal {
    beRealId: number;
    user: User;
    frontPhoto: Uint8Array
    backPhoto: Uint8Array
    location?: string;
    dateCreated: Date;
}
export interface BeRealInput {
    user: User;
    frontPhoto: number[]
    backPhoto: number[];
    location: string;
}
