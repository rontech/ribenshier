import { Profile } from './profile.model';

export interface Notification {
  _id?: string;
  objId?: string;
  objType?: string;
  notType?: string;
  message?: string;
  senderId?: string;
  profile?: Profile;
  toId?: string;
  read?: boolean;
  createdAt?: Date;
}
