import { heartOrUnHeart } from "@/services/posts";

const toggleLikes = async (
  isLiked: boolean,
  postId: string,
  successCbk: Function,
  failureCbk: Function
) => {
  try {
    const response = await heartOrUnHeart(postId);
    if (
      response.code === 200 &&
      response.flag &&
      response.message?.length > 0
    ) {
      successCbk({ msg: response.message, flagHeart: isLiked });
    }
  } catch (error) {
    
    failureCbk("Error");
  }
};

export { toggleLikes };
