import { Meteor } from 'meteor/meteor';
 
import { Houses } from '../../../both/collections/houses.collection';
import { House } from '../../../both/models/house.model';
import { Users } from '../../../both/collections/users.collection';
import { User } from '../../../both/models/user.model';
import { HousePictures } from '../../../both/collections/house-pictures.collection';
import { HousePicture } from '../../../both/models/house-picture.model';
 
Meteor.publishComposite('houses', function(): PublishCompositeConfig<House> {
  return {
    find: () => {
      return Houses.collection.find({});
    },
 
    children: [
      {
        find: (house) => {
          return Users.collection.find({
            _id: house.creatorId
          }, {
            fields: {profile: 1}
          });
        }
      },

      {
        find: (house) => {
          return HousePictures.collection.find({
            houseId: house._id
          }, {
            fields: {picture: 1, thumb: 1}
          });
        }
      },

    ]
  };
});
