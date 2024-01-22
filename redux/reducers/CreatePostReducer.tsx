import { ApplicationState } from "../store";
import { CreatePost } from "../types/CreatePost.types";

export interface CreatePostModalInfo {
  isModalOpen: boolean;
}

export const createPostModalInitialState: CreatePostModalInfo = {
  isModalOpen: false,
};
export const CreatePostReducer = (
  state = createPostModalInitialState,
  action: { type: string; data: any }
) => {
  switch (action.type) {
    case CreatePost.SET_POST_MODAL_OPEN:
      return { ...state, isModalOpen: action.data };
    default:
      return state;
  }
};

export const postModalSelector = (state: ApplicationState) => {
  return state.post;
};
