import { ObjectId } from 'mongodb';

export interface User {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
}

export interface RequestWithUser extends Request {
  user: User;
}
