export type PhotoUserType = {
  name: string;
  url: string;
};

export type GetUserInfoType = {
  id: number;
  email: string;
  name: string;
  fullName: string;
  avatar: string;
  photos: PhotoUserType[];
};
