import { Profile } from "./profile.model";

 export interface JobComment {
  _id?: string;
  jobId?: string;
  senderId?: string;
  profile?: Profile;
  content?: string;
  ownership?: string;
  createdAt?: Date;
}
