import { Profile } from './profile.model';

export interface ReplyComment{
    _id?: string;
    objId?:string;
    firstCommentId?: string;
    fromId?: string;
    toId?: string;
    content?: string;
    profile?: Profile;
    toProfile?: Profile;
    createdAt?: Date;
}