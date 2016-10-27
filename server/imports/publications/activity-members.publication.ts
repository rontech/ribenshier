import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
 
import { ActivityMembers } from '../../../both/collections/activity-members.collection';
import { ActivityMember } from '../../../both/models/activity-member.model';
 
Meteor.publish('activity-members', function(activityId: string): Mongo.Cursor<ActivityMember> {
  if (!activityId) return;
 
  return ActivityMembers.collection.find({activityId});
});

Meteor.publish('my-activities', function(userId: string): Mongo.Cursor<ActivityMember> {
  if (!userId) return;
 
  return ActivityMembers.collection.find({senderId: userId});
});
