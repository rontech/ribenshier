import { Profile } from './profile.model';

export interface CommonEntity {
  _id?: string;
  creatorId?: string;
  profile?: Profile;
  title?: string;
  content?: string;
  lastComment?: string;
  commented?: number;
  commentedAt?: Date;
  createdAt?: Date;
  sortedBy?: Date;
}
