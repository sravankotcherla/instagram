export interface barOptionInterface {
  imgURL: string;
  route?: string;
  label: string;
  onClick?: () => void;
  isPage?: boolean;
}
export const barOptions: barOptionInterface[] = [
  {
    imgURL: "/assets/home.svg",
    route: "/",
    label: "Home",
    isPage: true,
  },
  {
    imgURL: "/assets/search.svg",
    route: "/search",
    label: "Search",
    isPage: false,
  },
  {
    imgURL: "/assets/heart.svg",
    route: "/activity",
    label: "Activity",
    isPage: true,
  },
  {
    imgURL: "/assets/create.svg",
    label: "Create",
    isPage: false,
  },
  {
    imgURL: "/assets/user.svg",
    route: "/profile",
    label: "Profile",
    isPage: true,
  },
];
