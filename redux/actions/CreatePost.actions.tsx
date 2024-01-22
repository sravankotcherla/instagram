import { CreatePost } from "../types/CreatePost.types";

export const CreatePostActions = {
  setPostModalOpen: (data: boolean) => {
    return { type: CreatePost.SET_POST_MODAL_OPEN, data };
  },
};
