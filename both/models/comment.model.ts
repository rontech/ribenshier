import { Profile } from "./profile.model";

export interface Comment {
  _id?: string;
  topicId?: string;
  senderId?: string;
  profile?: Profile;
  content?: string;
  ownership?: string;
  createdAt?: Date;
}
