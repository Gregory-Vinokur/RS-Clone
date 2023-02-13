import { User } from 'firebase/auth';

type Sort = 'desc' | 'asc';

type TypeUser = User | null;

type UserProp = {
  userName: string;
  userStatus: string;
  userAvatar: string;
  userCover: string;
  userSubscripts: string;
  userId: string;
};

export { Sort, TypeUser, UserProp };
