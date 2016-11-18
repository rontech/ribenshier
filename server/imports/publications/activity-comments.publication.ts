import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
 
import { ActivityComments } from '../../../both/collections/activity-comments.collection';
import { ActivityComment } from '../../../both/models/activity-comment.model';
 
Meteor.publish('activity-comments', function(activityId: string): Mongo.Cursor<ActivityComment> {
  if (!activityId) return;
 
  return ActivityComments.collection.find({objId: activityId});
});
