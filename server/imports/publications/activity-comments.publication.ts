import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
 
import { ActivityComments } from '../../../both/collections/activity-comments.collection';
import { ActivityComment } from '../../../both/models/activity-comment.model';
import { Users } from '../../../both/collections/users.collection';
import { User } from '../../../both/models/user.model';
 
Meteor.publishComposite('activity-comments', function(activityId: string): PublishCompositeConfig<ActivityComment> {
  if (!activityId) return;
 
  return {
    find() {
      return ActivityComments.collection.find({objId: activityId});
    },

    children: [
      {
        find: (comment) => {
          return Meteor.users.find({
            _id: comment.senderId
          }, {
            fields: {profile: 1}
          });
        }
      }
    ]
  };
});
