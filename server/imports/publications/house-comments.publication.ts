import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
 
import { HouseComments } from '../../../both/collections/house-comments.collection';
import { HouseComment } from '../../../both/models/house-comment.model';
import { Users } from '../../../both/collections/users.collection';
import { User } from '../../../both/models/user.model';
 
Meteor.publishComposite('house-comments', function(houseId: string): PublishCompositeConfig<HouseComment> {
  if (!houseId) return;
 
  return {
    find() {
      return HouseComments.collection.find({objId: houseId});
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
