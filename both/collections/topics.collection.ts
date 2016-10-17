import { Topic } from "../models/topic.model";
import { MongoObservable } from "meteor-rxjs";
 
export const Topics = new MongoObservable.Collection<Topic>('topics');
