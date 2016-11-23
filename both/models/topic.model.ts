import { Profile } from './profile.model';
 
export interface Topic {
  _id?: string;
  title?: string;
  content?: string;
  picture?: string;
  pictureId?: string;
  thumb?: string;
  thumbId?: string;
  creatorId?: string;
  profile?: Profile;
  lastComment?: string;
  commented?: number;
  commentedAt?: Date;
  thumbed?: number;
  createdAt?: Date;
  sortedBy?: Date;
}
