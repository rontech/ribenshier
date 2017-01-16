import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
 
import { HouseSecondComments } from '../../../both/collections/house-second-comments.collection';
import { HouseSecondComment } from '../../../both/models/house-second-comment.model';
import { Users } from '../../../both/collections/users.collection';
import { User } from '../../../both/models/user.model';
 
Meteor.publishComposite('house-second-comments', function(houseId: string): PublishCompositeConfig<HouseSecondComment> {
  if (!houseId) return;
 
    return {
    find() {
      return HouseSecondComments.collection.find({objId: houseId});
    },

     children: [
      {
        find: (HouseSecondComment) => {
          return Meteor.users.find({
            _id: HouseSecondComment.fromId
          }, {
            fields: {profile: 1}
          });
        }
      }
    ]
  };
});
