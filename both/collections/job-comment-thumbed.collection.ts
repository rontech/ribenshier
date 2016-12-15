import { MongoObservable } from "meteor-rxjs";
import { JobCommentThumbed} from "../models/job-comment-thumbed.model";
 
export const JobCommentThumbeds = new MongoObservable.Collection<JobCommentThumbed>('job-comment-thumbeds');