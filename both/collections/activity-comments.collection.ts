import { MongoObservable } from "meteor-rxjs";
import { ActivityComment } from "../models/activity-comment.model";
 
export const ActivityComments = new MongoObservable.Collection<ActivityComment>('activity-comments');
