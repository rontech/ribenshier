import { MongoObservable } from "meteor-rxjs";
import { JobComment } from "../models/job-comment.model";
 
export const JobComments = new MongoObservable.Collection<JobComment>('job-comments');
