import { Main } from './imports/server-main/main';
import './imports/methods/methods';
import './imports/publications/topics.publication';
import './imports/publications/comments.publication';
import './imports/publications/users.publication';
import './imports/publications/images.publication';
import './imports/publications/activities.publication';
import './imports/publications/activity-members.publication';
import './imports/publications/activity-comments.publication';
import './imports/publications/houses.publication';
import './imports/publications/house-comments.publication';
import './imports/publications/house-pictures.publication';

const mainInstance = new Main();
mainInstance.start();
