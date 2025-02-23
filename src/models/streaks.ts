export interface IRequestNewReadPost {
  email: string;
  id: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmChannel: string;
}

export interface IFindPost {
  id: number;
  utmCampaign: string | null;
  utmChannel: string | null;
  utmMedium: string | null;
  utmSource: string | null;
  userEmail: string;
  resourceId: string;
  createdAt: Date;
}

export interface IUsersStreaksRequest {
  page: number;
  pageSize: number;
  year?: number;
  month?: number;
}
