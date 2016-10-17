export interface Comment {
  _id?: string;
  topicId?: string;
  senderId?: string;
  content?: string;
  ownership?: string;
  createdAt?: Date;
}
