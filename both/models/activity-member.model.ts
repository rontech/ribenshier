import { Profile } from './profile.model';

export interface ActivityMember {
  _id?: string;
  activityId?: string;
  senderId?: string;
  profile?: Profile;
  createdAt?: Date;
}
