import { Notification } from "../models/notification.model";
import { MongoObservable } from "meteor-rxjs";
 
export const Notifications = new MongoObservable.Collection<Notification>('notifications');
