import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
 
import { ActivitySecondComments } from '../../../both/collections/activity-second-comments.collection';
import { ActivitySecondComment } from '../../../both/models/activity-second-comment.model';
import { Users } from '../../../both/collections/users.collection';
import { User } from '../../../both/models/user.model';
 
Meteor.publishComposite('activity-second-comments', function(activityId: string): PublishCompositeConfig<ActivitySecondComment> {
  if (!activityId) return;
 
    return {
    find() {
      return ActivitySecondComments.collection.find({objId: activityId});
    },

     children: [
      {
        find: (ActivitySecondComment) => {
          return Meteor.users.find({
            _id: ActivitySecondComment.fromId
          }, {
            fields: {profile: 1}
          });
        }
      }
    ]
  };
});
