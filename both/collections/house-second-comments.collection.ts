import { MongoObservable } from "meteor-rxjs";
import { HouseSecondComment } from "../models/house-second-comment.model";
 
export const HouseSecondComments = new MongoObservable.Collection<HouseSecondComment>('house-second-comments');