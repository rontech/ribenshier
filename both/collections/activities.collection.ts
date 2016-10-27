import { Activity } from "../models/activity.model";
import { MongoObservable } from "meteor-rxjs";
 
export const Activities = new MongoObservable.Collection<Activity>('activities');
