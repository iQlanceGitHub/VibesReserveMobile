export const base_url_qa: string =
  "https://dev.iqlance-demo.com/ShoppyWhereBackend/api/";
export const base_url_client: string = "http://54.241.179.201/vr-api/";
export const paypalDevUrl = "https://api-m.paypal.com/v1/";

export const role_user: number = 1;
export const role_consultant: number = 2;
export const pending: string = "Pending";
export const rejected: string = "Rejected";
export const accepted: string = "Accepted";
export const audio: string = "Audio";
export const video: string = "Video";
export const chat: string = "Chat";
export const api_endpoint: Record<string, unknown> = {
  // Notification endpoints
  getNotificationList: "user/notificationlist",
  markNotificationAsRead: "user/marknotificationasread",
  // Help Support endpoints
  createHelpSupport: "user/createhelpsupport",
  // Promotional Codes endpoints
  getPromoCodes: "user/getpromocodes",
  editPromoCode: "user/editpromocode",
  createPromoCode: "user/createpromocode",
  deletePromoCode: "user/deletepromocode",
  // Event Detail endpoints
  getDetailEvent: "user/getdetailevent",
  updateEvent: "user/updateeventclubpub",
  deleteEventPart: "user/deleteeventpart",
  deleteEvent: "user/deleteevent",
};
