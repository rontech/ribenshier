import { MongoObservable } from "meteor-rxjs";
import { HouseCommentThumbed} from "../models/house-comment-thumbed.model";
 
export const HouseCommentThumbeds = new MongoObservable.Collection<HouseCommentThumbed>('house-comment-thumbeds');