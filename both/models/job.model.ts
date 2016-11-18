import { Profile } from './profile.model';
 
export interface Job {
  _id?: string;
  creatorId?: string,
  profile?: Profile;
  title?: string;
  location?: string;
  position?: string;
  people?: number;
  start?: Date;
  description?: string;
  lastComment?: string;
  commented?: number;
  commentedAt?: Date;
  createdAt?: Date;
  sortedBy?: Date;
}
