import { Job } from "../models/job.model";
import { MongoObservable } from "meteor-rxjs";
 
export const Jobs = new MongoObservable.Collection<Job>('jobs');
