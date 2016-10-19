import { MongoObservable } from "meteor-rxjs";
import { TopicThumbed } from "../models/topic-thumbed.model";
 
export const TopicThumbeds = new MongoObservable.Collection<TopicThumbed>('topic-thumbed');
