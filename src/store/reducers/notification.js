import {colors} from '../../assets/styles/_colors';
import {SHOW_NOTIFICATION} from '../actions/types';
const initialState = {background: colors.secondaryBackground};

export const notification = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      state = action.payload;
      return {...state};
    default:
      return state;
  }
};
