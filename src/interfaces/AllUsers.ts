export default interface AllUsers {
  avatar?: string;
  dialogRooms?: { [key: string]: object };
  groupRooms?: { [key: string]: object };
  subscripts: { [key: string]: boolean };
  userAvatar: string;
  userCover: string;
  userId: string;
  userMusic?: { [key: string]: object };
  userName: string;
  userStatus: string;
}
