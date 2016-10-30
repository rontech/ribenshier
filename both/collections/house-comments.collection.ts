import { MongoObservable } from "meteor-rxjs";
import { HouseComment } from "../models/house-comment.model";
 
export const HouseComments = new MongoObservable.Collection<HouseComment>('house-comments');
