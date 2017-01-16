import { MongoObservable } from "meteor-rxjs";
import { JobSecondComment } from "../models/job-second-comment.model";
 
export const JobSecondComments = new MongoObservable.Collection<JobSecondComment>('job-second-comments');