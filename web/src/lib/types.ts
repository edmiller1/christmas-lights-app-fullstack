export interface User {
  id: string;
  externalId: string;
  name: string | null;
  email: string;
  image: string | null;
  emailVerified: boolean;
  provider: string;
  plan: string;
  admin: boolean;
  notificationsOnAppVerification: boolean;
  notificationsOnAppRating: boolean;
  notificationsByEmailVerification: boolean;
  notificationsByEmailRating: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DecorationImage {
  id: string;
  url: string;
  index: number;
  base64Value: string;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  unread: boolean;
  createdAt: string;
  updatedAt?: string;
  userId: string;
}
