import { User } from 'firebase/auth';
import { PATCH_TO_DB } from './constans';

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

type GroupProps = {
  nameGroup: string;
  uid: string;
  [PATCH_TO_DB.LAST_CHANGE]: number;
  members: {
    [x: string]: boolean;
  };
};

export { Sort, TypeUser, UserProp, GroupProps };
