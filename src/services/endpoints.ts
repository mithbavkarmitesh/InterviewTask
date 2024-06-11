export const Endpoints = {
  GetInterests: "postgres/app-user/findoutinterestAndhobbies",
  GetPublicReels: "mongo/reels/public-reels",
  Send_Email_OTP: "postgres/email/send-email-otp",
  Send_Phone_OTP: "postgres/smsCountry/sending-phoneOTP",
  Verify_Email_OTP: `postgres/email/verify-email-otp`,
  Verify_Phone_OTP: `postgres/smsCountry/verify-PhoneOTP`,
  RegisterUser: "postgres/app-user/userRegistration",
  RequestJWTToken: "postgres/auth/authToken",
  GetCommentsForPost: "postgres/comment/getallCommentsforApost",
  MakeCommentOnPost: "postgres/comment/makeComment",
  UserInformation: "postgres/app-user/requestedUserFullInfo",
  Get_Region: "postgres/generic/region/",
  Heart_Unheart: "postgres/hearts/heartOrUnHeart/",
  UserAllPosts: "mongo/posts/userPosts",
  UserAllImages: "mongo/userInfo/imageUrls",
  UserAllVideos: "mongo/userInfo/videoUrls",
  AddDisplayPhoto: "postgres/app-user/addDisplayPhoto",
  RemoveDisplayPhoto: "postgres/app-user/removeDisplayPhoto",
  AddCoverPhoto: "postgres/app-user/addCoverPhoto",
  RemoveCoverPhoto: "postgres/app-user/removeCoverPhoto",
  FollowUser: "mongo/followed/follow/",
  UnfollowUser: "mongo/followed/unfollow/",
  FollowingCounter: "mongo/followed/followings/count/",
  FollowersCounter: "mongo/followed/followers/count/",
  FriendsCounter: "mongo/friends/count/",
  FamilyCounter: "mongo/friends/count/",
  AllCounter: "mongo/allcounters/",
  SaveMyPost: "contents/posts/save",
  GetUserPosts: "mongo/posts/userPosts",
  GetDashboardPosts: "contents/posts/dashboardPosts",
  SaveFcmToken: "mongo/userToken/fcm-tokens",
  GetAllNotifications: "mongo/notifications/getallNotifications/",
  HeartOrUnheartStory: "postgres/heartStory/heartOrUnheartStory/",
};
