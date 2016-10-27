 import { Profile } from "./profile.model";
 
 export interface ActivityComment {
  _id?: string;
  activityId?: string;
  senderId?: string;
  profile?: Profile;
  content?: string;
  ownership?: string;
  createdAt?: Date;
}
