import { Profile } from './profile.model';

export interface HouseSecondComment{
    _id?: string;
    objId?:string;
    firstCommentId?: string;
    fromId?: string;
    toId?: string;
    content?: string;
    profile?: Profile;
    toProfile?: Profile;
    ownership?: string;
    createdAt?: Date;
}