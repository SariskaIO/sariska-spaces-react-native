import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {REQUEST_TO_SPEAK, USER_ROLE, USER_SUB_ROLE_CHANGED} from '../constants';
import {showNotification} from '../store/actions/notification';
import {
  addLocalTrack,
  addRemoteTrack,
  remoteAllLocalTracks,
  remoteTrackMutedChanged,
  removeRemoteTrack,
} from '../store/actions/track';
import NetInfo from '@react-native-community/netinfo';
import {clearAllReducers} from '../store/actions/conference';
import {
  addParticipant,
  participantPropertyChanged,
  removeParticipant,
  updateLocalParticipantSubRole,
} from '../store/actions/participant';
import {setRaiseHand} from '../store/actions/layout';
import {removeThumbnailColor} from '../store/actions/color';
import {addMessage} from '../store/actions/message';
import {unreadMessage} from '../store/actions/chat';
import {getUserById} from '../utils';
import {setAudioLevel} from '../store/actions/audioIndicator';
import {addSubRole} from '../store/actions/profile';
import {Home} from './Home';
import ParticipantsGrid from '../components/Space/ParticipantsGrid';
import {colors} from '../assets/styles/_colors';
import BodyView from '../components/shared/BodyView';
import StyledView from '../components/shared/StyledView';
import SariskaMediaTransport from 'sariska-media-transport/dist/esm/SariskaMediaTransport';
import {PermissionDialog} from '../components/shared/PermissionDialog';
import {ReconnectDialog} from '../components/shared/ReconnectDialog';
import {RequestToSpeak} from '../components/shared/RequestToSpeak';
import SnackbarBox from '../components/shared/SnackbarBox';

export const Space = () => {
  const dispatch = useDispatch();
  const localTracks = useSelector(state => state.localTrack);
  const remoteTracks = useSelector(state => state.remoteTrack);
  const conference = useSelector(state => state.conference);
  const connection = useSelector(state => state.connection);
  const layout = useSelector(state => state.layout);
  const notification = useSelector(state => state.notification);
  const [dominantSpeakerId, setDominantSpeakerId] = useState(null);
  const [lobbyUserJoined, setLobbyUserJoined] = useState({});
  const [minimize, setMinimize] = useState(false);
  const profile = useSelector(state => state.profile);
  const [requestToSpeak, setRequestToSpeak] = useState(null);
  const [muteAll, setMuteAll] = useState(false);

  const handleMuteAllClick = async () => {
    for (let key of Object.keys(remoteTracks)) {
      await conference.muteParticipant(key, 'audio');
    }
    dispatch(remoteTrackMutedChanged());
    setMuteAll(true);
  };

  const handleMinimize = () => {
    setMinimize(!minimize);
  };

  const allowLobbyAccess = () => {
    conference.lobbyApproveAccess(lobbyUserJoined.id);
    setLobbyUserJoined({});
  };

  const denyLobbyAccess = () => {
    conference.lobbyDenyAccess(lobbyUserJoined.id);
    setLobbyUserJoined({});
  };

  const requestToSpeakAllow = () => {
    conference.sendEndpointMessage(requestToSpeak.participantId, {
      action: USER_SUB_ROLE_CHANGED,
      payload: {
        participantId: requestToSpeak.participantId,
        role: USER_ROLE.SPEAKER,
      },
    });
    conference.revokeOwner(requestToSpeak.participantId);
    setRequestToSpeak(null);
  };

  const requestToSpeakDeny = () => {
    setRequestToSpeak(null);
  };

  const updateNetwork = NetInfo.addEventListener(state => {
    // set internet connectivity status
    if (!state.isConnected) {
      dispatch(
        showNotification({
          message: 'You lost your internet connection. Trying to reconnect...',
          background: colors.secondaryBackground,
        }),
      );
    }
    SariskaMediaTransport.setNetworkInfo({isOnline: state.isConnected});
  });

  const destroy = async () => {
    if (conference?.isJoined()) {
      await conference?.leave();
    }
    for (const track of localTracks) {
      await track.dispose();
    }
    await connection?.disconnect();

    const unsubscribeUpdateNetwork = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        updateNetwork();
      } else {
        updateNetwork();
      }
    });
    unsubscribeUpdateNetwork();
    dispatch(clearAllReducers());
  };
  console.log('lobbyUserJoined', lobbyUserJoined);
  useEffect(() => {
    if (!conference) {
      return;
    }
    conference
      .getParticipantsWithoutHidden()
      .forEach(participant => dispatch(addParticipant(participant)));

    conference.addEventListener(
      SariskaMediaTransport.events.conference.TRACK_ADDED,
      track => {
        if (track.isLocal()) {
          return;
        }
        dispatch(addRemoteTrack(track));
      },
    );
    conference.addEventListener(
      SariskaMediaTransport.events.conference.TRACK_REMOVED,
      track => {
        dispatch(removeRemoteTrack(track));
      },
    );
    conference.addEventListener(
      SariskaMediaTransport.events.conference.TRACK_MUTE_CHANGED,
      track => {
        dispatch(remoteTrackMutedChanged());
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.DOMINANT_SPEAKER_CHANGED,
      id => {
        setDominantSpeakerId(id);
      },
    );
    conference.addEventListener(
      SariskaMediaTransport.events.conference.PARTICIPANT_PROPERTY_CHANGED,
      async (participant, key, oldValue, newValue) => {
        if (key === 'handraise' && newValue === 'start') {
          dispatch(
            setRaiseHand({participantId: participant._id, raiseHand: true}),
          );
        }

        if (key === 'handraise' && newValue === 'stop') {
          dispatch(
            setRaiseHand({participantId: participant._id, raiseHand: false}),
          );
        }
        dispatch(participantPropertyChanged());
      },
    );
    conference.addEventListener(
      SariskaMediaTransport.events.conference.KICKED,
      participant => {
        // if a user kicked by moderator
        // kicked participant id
        dispatch(
          showNotification({
            message: ` Participant ${participant._identity.user.name} has been removed`,
            background: colors.secondaryBackground,
          }),
        );
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.PARTICIPANT_KICKED,
      (actorParticipant, kickedParticipant, reason) => {
        dispatch(
          showNotification({
            message: `${actorParticipant} has removed ${kickedParticipant} for ${reason}`,
            background: colors.secondaryBackground,
          }),
        );
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.USER_LEFT,
      id => {
        dispatch(removeThumbnailColor(id));
        dispatch(removeParticipant(id));
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.MESSAGE_RECEIVED,
      (id, text, ts) => {
        dispatch(addMessage({text: text, user: getUserById(id, conference)}));
        if (id !== conference.myUserId()) {
          dispatch(unreadMessage(1));
        }
      },
    );
    conference.addEventListener(
      SariskaMediaTransport.events.conference.NOISY_MIC,
      () => {
        dispatch(
          showNotification({
            message: 'Your mic seems to be noisy',
            background: colors.secondaryBackground,
          }),
        );
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.TALK_WHILE_MUTED,
      () => {
        dispatch(
          showNotification({
            message: 'Trying to speak?  your are muted!!!',
            background: colors.secondaryBackground,
          }),
        );
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.NO_AUDIO_INPUT,
      () => {
        dispatch(
          showNotification({
            message: 'Looks like device has no audio input',
            background: colors.primaryBackground,
          }),
        );
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.TRACK_AUDIO_LEVEL_CHANGED,
      (participantId, audioLevel) => {
        dispatch(setAudioLevel({participantId, audioLevel}));
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.LOBBY_USER_JOINED,
      (id, displayName) => {
        // new Audio(
        //   'https://sdk.sariska.io/knock_0b1ea0a45173ae6c10b084bbca23bae2.ogg',
        // ).play();
        console.log('id dis', id, displayName);
        setLobbyUserJoined({id, displayName});
      },
    );

    conference.addEventListener(
      SariskaMediaTransport.events.conference.ENDPOINT_MESSAGE_RECEIVED,
      async (participant, data) => {
        const {action, payload} = data;
        if (action === USER_SUB_ROLE_CHANGED) {
          const newRole = payload?.role;
          if (
            profile?.subRole === USER_ROLE.LISTENER &&
            (newRole === USER_ROLE.SPEAKER ||
              newRole === USER_ROLE.CO_HOST ||
              newRole === USER_ROLE.HOST)
          ) {
            const options = {devices: ['audio']};
            const newLocalTracks =
              await SariskaMediaTransport?.createLocalTracks(options);
            const [audioTrack] = newLocalTracks;
            dispatch(addLocalTrack(audioTrack));
            await conference.addTrack(audioTrack);
            newLocalTracks?.forEach(track => dispatch(addLocalTrack(track)));
          }

          if (newRole === USER_ROLE.LISTENER) {
            localTracks?.forEach(async track => await track.dispose());
            dispatch(remoteAllLocalTracks());
          }

          conference.setLocalParticipantProperty('subRole', newRole);
          dispatch(addSubRole(newRole));
          dispatch(updateLocalParticipantSubRole(payload));
        }

        if (action === REQUEST_TO_SPEAK) {
          setRequestToSpeak(payload);
        }
      },
    );
    const unsubscribeUpdateNetwork = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        updateNetwork();
      } else {
        updateNetwork();
      }
    });
    unsubscribeUpdateNetwork();
    SariskaMediaTransport.effects.createRnnoiseProcessor();
    return () => {
      destroy();
    };
  }, [conference]);

  if (!conference) {
    return <Home />;
  }

  return (
    <BodyView>
      <StyledView>
        <View style={styles.body}>
          <ParticipantsGrid dominantSpeakerId={dominantSpeakerId} />
          {lobbyUserJoined.id && (
            <PermissionDialog
              denyLobbyAccess={denyLobbyAccess}
              allowLobbyAccess={allowLobbyAccess}
              displayName={lobbyUserJoined.displayName}
            />
          )}
          <SnackbarBox notification={notification} />
          <ReconnectDialog open={layout.disconnected} />
          {requestToSpeak?.participantId && (
            <RequestToSpeak
              requestToSpeak={requestToSpeak}
              allow={requestToSpeakAllow}
              deny={requestToSpeakDeny}
            />
          )}
        </View>
      </StyledView>
    </BodyView>
  );
};

const styles = StyleSheet.create({
  body: {
    justifyContent: 'flex-start',
    width: '100%',
    height: '100%',
  },
});
