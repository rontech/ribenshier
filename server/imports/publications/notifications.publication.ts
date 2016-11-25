import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
 
import { Notifications } from '../../../both/collections/notifications.collection';
import { Notification } from '../../../both/models/notification.model';
import { Users } from '../../../both/collections/users.collection';
import { User } from '../../../both/models/user.model';
 
Meteor.publishComposite('notifications', function(toId: string): PublishCompositeConfig<Notification> {
  return {
    find: () => {
      return Notifications.collection.find({toId: toId});
    },

    children: [
      {
        find: (not) => {
          return Meteor.users.find({
            _id: not.senderId
          }, {
            fields: {profile: 1}
          });
        }
      }
    ]
  };
});
