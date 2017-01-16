import { MongoObservable } from "meteor-rxjs";
import { ReplyComment } from "../models/reply-comment.model";
 
export const ReplyComments = new MongoObservable.Collection<ReplyComment>('reply-comments');