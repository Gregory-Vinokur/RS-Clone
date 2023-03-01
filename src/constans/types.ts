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

type DialogMessages = {
  uid: string;
  key: string;
  name: string;
  avatar: string;
  text: string;
  time: number;
};

type GroupProps = {
  nameGroup: string;
  groupAvatar: string;
  messages: {
    [x: string]: DialogMessages;
  };
  uid: string;
  [PATCH_TO_DB.LAST_CHANGE]: number;
  members: {
    [x: string]: boolean;
  };
};

type EmitsNameViewProfile =
  | 'uploadAvatar'
  | 'changeLang'
  | 'changeName'
  | 'changeStatus'
  | 'createNews'
  | 'deletePost'
  | 'uploadPostImg'
  | 'subscriptionUser'
  | 'unsubscriptionUser'
  | 'likePost'
  | 'openUserPage'
  | 'changePostsCounter'
  | 'shareNews';

export { Sort, TypeUser, UserProp, GroupProps, DialogMessages, EmitsNameViewProfile };
