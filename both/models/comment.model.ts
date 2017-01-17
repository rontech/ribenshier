import { Profile } from './profile.model';

export interface Comment {
  _id?: string;
  objId?: string;
  senderId?: string;
  profile?: Profile;
  content?: string;
  ownership?: string;
  createdAt?: Date;
  type?: string;

}
