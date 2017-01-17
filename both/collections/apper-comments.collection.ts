import { MongoObservable } from "meteor-rxjs";
import { ApperComment } from "../models/apper-comment.model";
 
export const ApperComments = new MongoObservable.Collection<ApperComment>('apper-comments');