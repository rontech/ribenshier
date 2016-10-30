import { House } from "../models/house.model";
import { MongoObservable } from "meteor-rxjs";
 
export const Houses = new MongoObservable.Collection<House>('houses');
