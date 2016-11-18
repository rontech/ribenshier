import { Profile } from './profile.model';
 
export interface House {
  _id?: string;
  creatorId?: string,
  profile?: Profile;
  title?: string;
  type?: string
  forRental?: boolean;
  brief?: string;
  description?: string;
  floorPlan?: string;
  area?: number;
  acess?: string;
  built?: number;
  price?: number;
  picture?: string;
  pictureId?: string;
  thumb?: string;
  thumbId?: string;
  pictures?: Array<string>;
  thumbs?: Array<string>;
  lastComment?: string;
  commented?: number;
  commentedAt?: Date;
  createdAt?: Date;
  sortedBy?: Date;
}
