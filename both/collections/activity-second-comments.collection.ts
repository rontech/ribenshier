import { MongoObservable } from "meteor-rxjs";
import { ActivitySecondComment } from "../models/activity-second-comment.model";
 
export const ActivitySecondComments = new MongoObservable.Collection<ActivitySecondComment>('activity-second-comments');