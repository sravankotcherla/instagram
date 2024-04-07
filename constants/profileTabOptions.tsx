export enum ProfileTab {
  POSTS = "posts",
  SAVED = "saved",
  TAGGED = "tagged",
}

export const tabOptions: { label: string; id: ProfileTab }[] = [
  { label: "POSTS", id: ProfileTab.POSTS },
  { label: "SAVED", id: ProfileTab.SAVED },
  { label: "TAGGED", id: ProfileTab.TAGGED },
];
