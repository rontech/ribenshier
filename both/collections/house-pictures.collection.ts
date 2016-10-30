import { MongoObservable } from "meteor-rxjs";
import { HousePicture } from "../models/house-picture.model";
 
export const HousePictures = new MongoObservable.Collection<HousePicture>('house-pictures');
