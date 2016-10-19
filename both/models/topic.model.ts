import { Comment } from "./comment.model";
 
export interface Topic {
  _id?: string;
  title?: string;
  content?: string;
  picture?: string;
  pictureId?: string;
  thumb?: string;
  thumbId?: string;
  creatorId?: string,
  lastComment?: Comment;
  commented: number;
  thumbed?: number;
  createdAt?: Date;
}
