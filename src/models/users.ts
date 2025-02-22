export interface ICreateUser {
  email: string;
  name: string;
  password: string;
}

export interface IUserActivity {
  id: number;
  utmCampaign: string | null;
  utmChannel: string | null;
  utmMedium: string | null;
  utmSource: string | null;
  userEmail: string;
  resourceId: string;
  createdAt: Date;
  updatedAt: Date;
}
