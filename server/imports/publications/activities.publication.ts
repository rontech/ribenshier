import { Meteor } from 'meteor/meteor';
 
import { Activities } from '../../../both/collections/activities.collection';
import { Activity } from '../../../both/models/Activity.model';
import { Users } from '../../../both/collections/users.collection';
import { User } from '../../../both/models/user.model';
 
Meteor.publishComposite('activities', function(): PublishCompositeConfig<Activity> {
  return {
    find: () => {
      return Activities.collection.find({});
    },
 
    children: [
      <PublishCompositeConfig1<Activity, User>> {
        find: (activity) => {
          return Meteor.users.find({
            _id: activity.creatorId
          }, {
            fields: {profile: 1}
          });
        }
      }
    ]
  };
});
