import * as Constants from './types';

export const setLayout = type => {
  return {
    payload: type,
    type: Constants.SET_LAYOUT,
  };
};

export const setFullScreen = mode => {
  return {
    type: Constants.SET_FULLSCREEN_MODE,
    payload: mode,
  };
};

export const setPinParticipant = id => {
  return {
    type: Constants.SET_PIN_PARTICIPANT,
    payload: id,
  };
};

export const setRaiseHand = payload => {
  return {
    type: Constants.SET_HAND_RAISE,
    payload,
  };
};

export const setDisconnected = disconnected => {
  return {
    type: Constants.SET_DISCONNECTED,
    payload: disconnected,
  };
};

export const setPresenter = id => {
  return {
    type: Constants.SET_PRESENTER,
    payload: id,
  };
};

export const setPresentationtType = payload => {
  return {
    type: Constants.SET_PRESENTATION_TYPE,
    payload,
  };
};
