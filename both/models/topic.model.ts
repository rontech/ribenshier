import { Comment } from "./comment.model";
import { Profile } from "./profile.model";
 
export interface Topic {
  _id?: string;
  title?: string;
  content?: string;
  picture?: string;
  pictureId?: string;
  thumb?: string;
  thumbId?: string;
  creatorId?: string,
  profile?: Profile;
  lastComment?: Comment;
  commented?: number;
  commentedAt?: Date;
  thumbed?: number;
  createdAt?: Date;
}
