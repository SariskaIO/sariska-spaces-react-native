import {
  SET_PROFILE,
  SET_SUB_ROLE,
  SET_SPACE_TITLE,
  SET_SPACE_TYPE,
  SET_NAME,
} from '../actions/types';

const initialState = {
  name: '',
  spaceTitle: '',
  avatar: '',
  role: '',
  id: '',
  subRole: '',
  spaceType: 'public',
};

export const profile = (state = initialState, action) => {
  switch (action.type) {
    case SET_PROFILE:
      const {name, avatar, id, role} = action.payload;
      state.name = name;
      state.avatar = avatar;
      state.id = id;
      state.role = role;
      return {...state};
    case SET_SUB_ROLE:
      state.subRole = action.payload;
      return {...state};
    case SET_SPACE_TITLE:
      state.spaceTitle = action.payload;
      return {...state};
    case SET_SPACE_TYPE:
      state.spaceType = action.payload;
      return {...state};
    case SET_NAME:
      state.name = action.payload;
      return {...state};
    default:
      return state;
  }
};
