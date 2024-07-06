export interface LinkData {
  name: string;
  desc: string;
  icon: string;
  link: string;
}

export const friends: LinkData[] = [
  {
    name: "上冬十二",
    desc: "到最后，竟庆幸于夕阳仍留在身上",
    icon: "/logo.svg",
    link: "https://oragekk.me/",
  },
  {
    name: "Mr.Hope",
    desc: "VuePress Theme Hope Creator",
    icon: "https://mister-hope.com/logo.svg",
    link: "https://mister-hope.com/",
  },
];
export const invalid: LinkData[] = [];
