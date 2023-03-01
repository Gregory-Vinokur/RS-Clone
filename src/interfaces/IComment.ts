export interface IComment {
    text: string,
    author: string,
    date: number,
    logo: string,
    id: string | null,
    likes: number,
    liked: { [key: string]: boolean }
}