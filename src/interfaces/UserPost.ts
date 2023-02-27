export default interface UserPost {
  author: string;
  createdUser: string;
  date: number;
  id: string;
  image?: string;
  likes: number;
  liked: { [key: string]: boolean };
  logo: string;
  reposted?: { [key: string]: boolean };
  shares: number;
  text: string;
  postsId: string;
}
