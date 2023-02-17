import { IComment } from './IComment';
export interface IPost {
  author: string;
  date: number;
  text: string;
  image?: string;
  likes: number;
  shares: number;
  logo: string;
  comments: Array<IComment>;
  liked: string;
  reposted: string;
}
