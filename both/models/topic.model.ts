import { Comment } from "./comment.model";
 
export interface Topic {
  _id?: string;
  memberIds?: string[];
  title?: string;
  subTitle?: string;
  content?: string;
  picture?: string;
  creatorId?: string,
  lastComment?: Comment;
}
