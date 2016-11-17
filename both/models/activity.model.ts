import { Profile } from "./profile.model";
 
export interface Activity {
  _id?: string;
  title?: string;
  status?: string;
  day?: Date;
  people?: number;
  deadline?: Date;
  description?: string;
  creatorId?: string,
  profile?: Profile;
  lastComment?: string;
  commented?: number;
  commentedAt?: Date;
  joined?: number;
  createdAt?: Date;
  sortedBy?: Date;
}
