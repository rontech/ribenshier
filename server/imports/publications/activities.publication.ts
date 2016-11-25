import { Meteor } from 'meteor/meteor';
 
import { Activities } from '../../../both/collections/activities.collection';
import { Activity } from '../../../both/models/activity.model';
import { Users } from '../../../both/collections/users.collection';
import { User } from '../../../both/models/user.model';
import { ActivityMembers } from '../../../both/collections/activity-members.collection';
import { ActivityMember } from '../../../both/models/activity-member.model';
 
Meteor.publishComposite('activities', function(): PublishCompositeConfig<Activity> {
  return {
    find: () => {
      return Activities.collection.find({});
    },
 
    children: [
      {
        find: (activity) => {
          return Meteor.users.find({
            _id: activity.creatorId
          }, {
            fields: {profile: 1}
          });
        }
      },
      {
        find: (activity) => {
          return ActivityMembers.collection.find({
            activityId: activity._id
          });
        },
        children: [
          { 
            find: (member, activity) => {
              return Meteor.users.find({_id: member.senderId}, {fields: {profile: 1}});
            }
          }
        ]
      }
    ]
  };
});
