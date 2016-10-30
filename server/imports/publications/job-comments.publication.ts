import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
 
import { JobComments } from '../../../both/collections/job-comments.collection';
import { JobComment } from '../../../both/models/job-comment.model';
 
Meteor.publish('job-comments', function(jobId: string): Mongo.Cursor<JobComment> {
  if (!jobId) return;
 
  return JobComments.collection.find({jobId});
});
