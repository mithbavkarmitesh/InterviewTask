import Images from "@/theme/assets/images";
import { MediaList, Restrictions } from "./types";
type MediaType = "image" | "video" | "unknown";

export default {
  Buttons: [
    {
      iconSource: Images.icons.cameraIcon,
    },
    {
      iconSource: Images.icons.videoIcon,
    },
    {
      iconSource: Images.icons.mapPinIcon,
    },
  ],

  StatusVisibilityMockData: [
    {
      id: 5,
      text: "Anyone",
      iconSource: Images.icons.globeIcon,
      type: Restrictions.PUBLIC_POST,
    },
    {
      id: 3,
      text: "Family",
      iconSource: Images.icons.familyIcon,
      type: Restrictions.PRIVATE_FAMILY,
    },
    {
      id: 2,
      text: "Friends",
      iconSource: Images.icons.friendsIcon,
      type: Restrictions.PRIVATE_FRIENDS,
    },
    {
      id: 1,
      text: "Private",
      iconSource: Images.icons.privateLockIcon,
      type: Restrictions.PRIVATE_OWN_POST,
    },
    // TODO
    //  4: friends and family both
  ],

  getMediaType: function (item: MediaList): MediaType {
    if (item.mime.startsWith("image/")) {
      return "image";
    } else if (item.mime.startsWith("video/")) {
      return "video";
    } else {
      return "unknown";
    }
  },
  countMediaTypes: function (
    mediaArray: MediaList[]
  ): Record<MediaType, number> {
    const counts: Record<MediaType, number> = {
      image: 0,
      video: 0,
      unknown: 0,
    };

    for (const item of mediaArray) {
      const type = this.getMediaType(item);
      counts[type]++;
    }

    return counts;
  },
};
