import { Meteor } from 'meteor/meteor';
 
import { Jobs } from '../../../both/collections/jobs.collection';
import { Job } from '../../../both/models/job.model';
import { Users } from '../../../both/collections/users.collection';
import { User } from '../../../both/models/user.model';
 
Meteor.publishComposite('jobs', function(): PublishCompositeConfig<Job> {
  return {
    find: () => {
      return Jobs.collection.find({});
    },
 
    children: [
      {
        find: (job) => {
          return Users.collection.find({
            _id: job.creatorId
          }, {
            fields: {profile: 1}
          });
        }
      }
    ]
  };
});

Meteor.publish('jobs-user', function(userId: string): Mongo.Cursor<Job> {
  if (!userId) return;

  return Jobs.collection.find({creatorId: userId});
});
