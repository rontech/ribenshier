import { MongoObservable } from "meteor-rxjs";
import { ActivityMember } from "../models/activity-member.model";
 
export const ActivityMembers = new MongoObservable.Collection<ActivityMember>('activity-members');
