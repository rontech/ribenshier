import { Bookmark } from './bookmark.model';
 
export interface Bookmark {
  _id?: string;
  objId?: string,
  type?: string;
  title?: string;
  senderId?: string,
  thumbnail?: string
  createdAt?: Date;
}
