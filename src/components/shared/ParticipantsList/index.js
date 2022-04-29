import React, {useState} from 'react';
import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {SIZES} from '../../../assets/styles/font';
import {colors} from '../../../assets/styles/_colors';
import {
  REQUEST_TO_SPEAK,
  USER_ROLE,
  USER_SUB_ROLE_CHANGED,
} from '../../../constants';
import AvatarBox from '../AvatarBox';
import {ContextMenu} from '../ContextMenu';

const ParticipantsList = ({dominantSpeakerId, localHandRaise}) => {
  const [contextHostMenu, setContextHostMenu] = useState(false);
  const [contextCoHostMenu, setContextCoHostMenu] = useState(false);
  const [contextSpeakerMenu, setContextSpeakerMenu] = useState(false);
  const [contextListenerMenu, setContextListenerMenu] = useState(false);
  const spaceTitle = useSelector(state => state.profile?.spaceTitle);
  const conference = useSelector(state => state.conference);
  const profile = useSelector(state => state.profile);
  const participants = useSelector(state => state.participant);

  const handleContextHostMenu = () => {
    setContextHostMenu(!contextHostMenu);
  };

  const handleContextCoHostMenu = () => {
    setContextCoHostMenu(!contextCoHostMenu);
  };

  const handleContextSpeakerMenu = () => {
    setContextSpeakerMenu(!contextSpeakerMenu);
  };

  const handleContextListenerMenu = () => {
    setContextListenerMenu(!contextListenerMenu);
  };

  const handleHostMenuClose = () => {
    setContextHostMenu(false);
  };

  const handleCoHostMenuClose = (selectedItem, participantId) => {
    if (selectedItem === 'Make Host') {
      conference.sendEndpointMessage(participantId, {
        action: USER_SUB_ROLE_CHANGED,
        payload: {participantId, role: USER_ROLE.HOST},
      });
      conference.grantOwner(participantId);
    }
    if (selectedItem === 'Make Speaker') {
      conference.sendEndpointMessage(participantId, {
        action: USER_SUB_ROLE_CHANGED,
        payload: {participantId, role: USER_ROLE.SPEAKER},
      });
      conference.revokeOwner(participantId);
    }
    if (selectedItem === 'Remove Co-host') {
      conference.kickParticipant(participantId, 'Removing Co-host');
    }
    if (selectedItem === 'Mute') {
      conference.muteParticipant(participantId, 'audio');
    }
    setContextCoHostMenu(false);
  };

  const handleSpeakerMenuClose = (selectedItem, participantId) => {
    if (selectedItem === 'Make Co-host') {
      conference.sendEndpointMessage(participantId, {
        action: USER_SUB_ROLE_CHANGED,
        payload: {participantId, role: USER_ROLE.CO_HOST},
      });
      conference.grantOwner(participantId);
    }
    if (selectedItem === 'Make Listener') {
      conference.sendEndpointMessage(participantId, {
        action: USER_SUB_ROLE_CHANGED,
        payload: {participantId, role: USER_ROLE.LISTENER},
      });
    }
    if (selectedItem === 'Mute') {
      conference.muteParticipant(participantId, 'audio');
    }
    if (selectedItem === 'Remove Speaker') {
      conference.kickParticipant(participantId);
    }
    setContextSpeakerMenu(false);
  };

  const handleListenerMenuClose = (selectedItem, participantId) => {
    if (selectedItem === 'Make Speaker') {
      conference.sendEndpointMessage(participantId, {
        action: USER_SUB_ROLE_CHANGED,
        payload: {participantId, role: USER_ROLE.SPEAKER},
      });
    }
    if (selectedItem === 'Remove Speaker') {
      conference.kickParticipant(participantId);
    }
    if (selectedItem === 'Mute') {
      conference.muteParticipant(participantId, 'audio');
    }
    if (selectedItem === 'Remove Listener') {
      conference.kickParticipant(participantId);
    }
    if (selectedItem === 'Request To Speak') {
      const host = conference
        .getParticipantsWithoutHidden()
        .find(item => item._properties.subRole === USER_ROLE.HOST);
      const participantName = participants.find(
        item => item._id === participantId,
      )?._identity?.user?.name;
      conference.sendEndpointMessage(host._id, {
        action: REQUEST_TO_SPEAK,
        payload: {participantId, hostId: host._id, participantName},
      });
    }
    setContextListenerMenu(false);
  };

  const hostMenu = {
    host: [],
  };

  const coHostMenu = {
    host: [
      {title: 'Make Host'},
      {title: 'Make Speaker'},
      {title: 'Mute'},
      {title: 'Remove Co-host'},
    ],
    cohost: [],
  };

  const speakerMenu = {
    host: [
      {title: 'Make Co-host'},
      {title: 'Make Listener'},
      {title: 'Mute'},
      {title: 'Remove Speaker'},
    ],
    cohost: [
      {title: 'Make Listener'},
      {title: 'Mute'},
      {title: 'Remove Speaker'},
    ],
    speaker: [],
  };

  const listenerMenu = {
    host: [
      {title: 'Make Speaker'},
      {title: 'Mute'},
      {title: 'Remove Listener'},
    ],
    cohost: [
      {title: 'Make Speaker'},
      {title: 'Mute'},
      {title: 'Remove Listener'},
    ],
    listener: [{title: 'Request To Speak'}],
  };
  console.log('partlist', participants);
  return (
    <View>
      <View style={styles.avatarContainer}>
        <FlatList
          data={participants}
          style={{
            height: 448,
            flexGrow: 0,
            paddingTop: 30,
            borderWidth: 1,
            borderBottomWidth: 2,
            borderColor: colors.grayBorder,
            borderRadius: 15,
          }}
          numColumns={3}
          horizontal={false}
          keyExtractor={participant => participant.id}
          renderItem={({item}) =>
            item._properties?.subRole === USER_ROLE.HOST ? (
              <ContextMenu
                list={hostMenu[profile?.subRole]}
                contextMenu={contextHostMenu}
                participantId={item._id}
                handleClose={handleHostMenuClose}
                handleContextMenu={handleContextHostMenu}>
                <AvatarBox
                  role={USER_ROLE.HOST}
                  isActiveSpeaker={dominantSpeakerId === item._id}
                  participantDetails={item?._identity?.user}
                  localUserId={conference.myUserId()}
                  onClick={handleContextHostMenu}
                  localHandRaise={localHandRaise}
                />
              </ContextMenu>
            ) : item._properties?.subRole === USER_ROLE.CO_HOST ? (
              <ContextMenu
                contextMenu={contextCoHostMenu}
                participantId={item._id}
                handleContextMenu={handleContextCoHostMenu}
                handleClose={handleCoHostMenuClose}
                list={coHostMenu[profile?.subRole]}>
                <AvatarBox
                  role={USER_ROLE.CO_HOST}
                  isActiveSpeaker={dominantSpeakerId === item._id}
                  participantDetails={item?._identity?.user}
                  localUserId={conference.myUserId()}
                  localHandRaise={localHandRaise}
                  onClick={handleContextCoHostMenu}
                />
              </ContextMenu>
            ) : item._properties?.subRole === USER_ROLE.SPEAKER ? (
              <ContextMenu
                contextMenu={contextSpeakerMenu}
                participantId={item._id}
                handleContextMenu={handleContextSpeakerMenu}
                handleClose={handleSpeakerMenuClose}
                list={speakerMenu[profile?.subRole]}>
                <AvatarBox
                  role={USER_ROLE.SPEAKER}
                  isActiveSpeaker={dominantSpeakerId === item._id}
                  participantDetails={item?._identity?.user}
                  localUserId={conference.myUserId()}
                  localHandRaise={localHandRaise}
                  onClick={handleContextSpeakerMenu}
                />
              </ContextMenu>
            ) : item._properties?.subRole === USER_ROLE.LISTENER ? (
              <ContextMenu
                contextMenu={contextListenerMenu}
                handleContextMenu={handleContextListenerMenu}
                participantId={item._id}
                handleClose={handleListenerMenuClose}
                list={listenerMenu[profile?.subRole]}>
                <AvatarBox
                  role={USER_ROLE.LISTENER}
                  isActiveSpeaker={dominantSpeakerId === item._id}
                  participantDetails={item?._identity?.user}
                  localUserId={conference.myUserId()}
                  localHandRaise={localHandRaise}
                  onClick={handleContextListenerMenu}
                />
              </ContextMenu>
            ) : null
          }
        />
      </View>
    </View>
  );
};

export default ParticipantsList;

const styles = StyleSheet.create({
  avatarContainer: {
    width: '100%',
  },
});
