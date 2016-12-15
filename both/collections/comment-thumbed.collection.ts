import { MongoObservable } from "meteor-rxjs";
import { CommentThumbed } from "../models/comment-thumbed.model";

export const CommentThumbeds = new MongoObservable.Collection<CommentThumbed>('comment-thumbed');