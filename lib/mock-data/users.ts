export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "admin" | "member" | "viewer";
}

export const users: User[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    avatar: "/avatars/sarah.jpg",
    role: "admin",
  },
  {
    id: "2",
    name: "Michael Johnson",
    email: "michael.johnson@company.com",
    avatar: "/avatars/michael.jpg",
    role: "member",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@company.com",
    avatar: "/avatars/emily.jpg",
    role: "member",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@company.com",
    avatar: "/avatars/david.jpg",
    role: "member",
  },
  {
    id: "5",
    name: "Alex Thompson",
    email: "alex.thompson@company.com",
    avatar: "/avatars/alex.jpg",
    role: "viewer",
  },
];

export const currentUser: User = users[0];
