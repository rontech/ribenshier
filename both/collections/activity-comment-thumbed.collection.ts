import { MongoObservable } from "meteor-rxjs";
import { ActivityCommentThumbed } from "../models/activity-comment-thumbed.model";

export const ActivityCommentThumbeds = new MongoObservable.Collection<ActivityCommentThumbed>('activity-comment-thumbed');
