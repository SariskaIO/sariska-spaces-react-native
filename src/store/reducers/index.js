import {combineReducers} from 'redux';
import {conference} from './conference';
import {connection} from './connection';
import {profile} from './profile';
import {layout} from './layout';
import {localTrack} from './localTrack';
import {remoteTrack} from './remoteTrack';
import {participant} from './participant';
import {audioIndicator} from './audioIndicator';
import {notification} from './notification';
import {message} from './message';
import {chat} from './chat';
import {color} from './color';

export const rootReducer = combineReducers({
  connection,
  profile,
  conference,
  layout,
  localTrack,
  remoteTrack,
  participant,
  color,
  audioIndicator,
  notification,
  message,
  chat,
});
