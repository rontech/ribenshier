import { Profile } from "./profile.model";

 export interface HouseComment {
  _id?: string;
  houseId?: string;
  senderId?: string;
  profile?: Profile;
  content?: string;
  ownership?: string;
  createdAt?: Date;
}
