import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Input} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {SIZES} from '../assets/styles/font';
import {colors} from '../assets/styles/_colors';
import {USER_ROLE} from '../constants';
import {addThumbnailColor} from '../store/actions/color';
import {addConference} from '../store/actions/conference';
import {addConnection} from '../store/actions/connection';
import {setDisconnected} from '../store/actions/layout';
import {addParticipant} from '../store/actions/participant';
import {
  addSpaceTitle,
  addSpaceType,
  addSubRole,
  setProfile,
} from '../store/actions/profile';
import {localTrackMutedChanged} from '../store/actions/track';
import {getRandomColor, getToken} from '../utils';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {RaisedButton} from '../components/shared/RaisedButton';
import BodyView from '../components/shared/BodyView';
import StyledView from '../components/shared/StyledView';
import SariskaMediaTransport from 'sariska-media-transport/dist/esm/SariskaMediaTransport';
import InputField from '../components/shared/InputField';
import SnackbarBox from '../components/shared/SnackbarBox';
import {notification} from '../store/reducers/notification';

export const Start = () => {
  const [audioTrack] = useSelector(state => state.localTrack);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [spaceTitle, setSpaceTitle] = useState('');
  const [buttonText, setButtonText] = useState('Create Stage');
  const [accessDenied, setAccessDenied] = useState(false);
  const [name, setName] = useState('');
  const profile = useSelector(state => state.profile);
  const route = useRoute();
  const navigation = useNavigation();
  let spaceType = route.params?.spaceType;
  let userRole = route.params?.role || profile?.subRole;

  const handleNameChange = value => {
    setName(value);
  };

  const handleSpaceChange = value => {
    setSpaceTitle(value);
  };

  const handleSubmit = async () => {
    let token;

    if (!spaceTitle) {
      return;
    }
    setLoading(true);
    const isModerator =
      !route.params?.spaceId ||
      userRole === USER_ROLE.HOST ||
      userRole === USER_ROLE.CO_HOST;
    token = await getToken(name, isModerator);
    console.log('token', token);
    if (!token) {
      return;
    }
    const connection = new SariskaMediaTransport.JitsiConnection(
      token,
      spaceTitle,
    );
    connection.addEventListener(
      SariskaMediaTransport.events.connection.CONNECTION_ESTABLISHED,
      () => {
        dispatch(addConnection(connection));
        createConference(connection);
      },
    );
    connection.addEventListener(
      SariskaMediaTransport.events.connection.CONNECTION_FAILED,
      error => {
        if (
          error ===
          SariskaMediaTransport.errors.connection.CONNECTION_DROPPED_ERROR
        ) {
          dispatch(setDisconnected(true));
        }
      },
    );
    connection.addEventListener(
      SariskaMediaTransport.events.connection.PASSWORD_REQUIRED,
      () => {
        connection.setToken(token); // token expired, set a new token
      },
    );
    connection.connect();
    dispatch(addSpaceTitle(spaceTitle));
    if (spaceType !== undefined) {
      dispatch(addSpaceType(spaceType));
    }
  };
  const createConference = async connection => {
    const conference = connection.initJitsiConference();
    console.log('conference', conference);
    if (userRole !== USER_ROLE.LISTENER) {
      conference.addTrack(audioTrack);
    }
    conference.addEventListener(
      SariskaMediaTransport.events.conference.CONFERENCE_JOINED,
      () => {
        console.log('conference joined');
        setLoading(false);
        dispatch(addConference(conference));
        dispatch(setProfile(conference?.getLocalUser()));
        const _properties = {};

        if (!route.params?.spaceId) {
          _properties['subRole'] = USER_ROLE.HOST;
          conference.setLocalParticipantProperty('subRole', USER_ROLE.HOST);
          dispatch(addSubRole(USER_ROLE.HOST));
        } else {
          _properties['subRole'] = userRole;
          conference.setLocalParticipantProperty('subRole', userRole);
          dispatch(addSubRole(userRole));
        }
        dispatch(
          addParticipant({
            _identity: {user: conference.getLocalUser()},
            _id: conference.myUserId(),
            _properties,
          }),
        );
        navigation.navigate('Space', {
          spaceId: spaceTitle,
          spaceType,
          role: userRole,
        });
      },
    );
    conference.addEventListener(
      SariskaMediaTransport.events.conference.CONFERENCE_ERROR,
      () => {
        console.log('conference error');
        setLoading(false);
      },
    );
    conference.addEventListener(
      SariskaMediaTransport.events.conference.USER_JOINED,
      (id, participant) => {
        console.log('user joined', id, participant);
        dispatch(
          addThumbnailColor({participantId: id, color: getRandomColor()}),
        );
        if (!participant._hidden) {
          dispatch(addParticipant(participant));
        }
      },
    );
    conference.addEventListener(
      SariskaMediaTransport.events.conference.USER_ROLE_CHANGED,
      id => {
        if (conference.isModerator()) {
          conference.enableLobby();
        }
      },
    );
    conference.addEventListener(
      SariskaMediaTransport.events.conference.CONFERENCE_FAILED,
      async error => {
        console.log('conference failed');
        if (
          error === SariskaMediaTransport.errors.conference.MEMBERS_ONLY_ERROR
        ) {
          setButtonText('Asking to join');
          conference.joinLobby(name);
        }

        if (
          error ===
          SariskaMediaTransport.errors.conference.CONFERENCE_ACCESS_DENIED
        ) {
          setAccessDenied(true);
          setButtonText('Join Stage');
          setLoading(false);
          setTimeout(() => setAccessDenied(false), 2000);
        }
      },
    );
    conference.join();
  };
  const unmuteAudioLocalTrack = async () => {
    await audioTrack.unmute();
    dispatch(localTrackMutedChanged());
  };
  const muteAudioLocalTrack = async () => {
    await audioTrack.mute();
    dispatch(localTrackMutedChanged());
  };
  useEffect(() => {
    if (route.params?.spaceId) {
      setButtonText('Join Stage');
      setSpaceTitle(route.params?.spaceId);
    }
    setName(profile?.name);
  }, [profile]);
  console.log('name is', name, spaceTitle, audioTrack, audioTrack?.isMuted());
  return (
    <BodyView>
      <ScrollView style={{width: '100%'}}>
        <StyledView>
          <Text style={styles.h1}>Your Stage</Text>
          <Text style={styles.subHeading}>
            As Stages are Public, anyone can
          </Text>
          <Text style={styles.subHeading}> join your Stage</Text>
          <View style={styles.inputContainer}>
            <View>
              <InputField
                label="Your Name"
                value={name}
                onChangeText={value => handleNameChange(value)}
                styles={styles.input}
                selectionColor={colors.secondaryText}
                inputStyle={{color: colors.secondaryText}}
                underlineColorAndroid="rgba(0,0,0,0)"
                labelStyle={{color: colors.secondaryText}}
              />
            </View>
            <View>
              <InputField
                label="Name Your Stage"
                value={spaceTitle}
                onChangeText={value => handleSpaceChange(value)}
                styles={styles.input}
                selectionColor={colors.secondaryText}
                inputStyle={{color: colors.secondaryText}}
                underlineColorAndroid="rgba(0,0,0,0)"
                labelStyle={{color: colors.secondaryText}}
              />
            </View>
          </View>
          {userRole !== USER_ROLE.LISTENER && (
            <View style={styles.iconContainer}>
              {audioTrack?.isMuted() ? (
                <MaterialIcon
                  name="mic-off"
                  color={colors.redIcon}
                  onPress={unmuteAudioLocalTrack}
                  style={styles.iconMuted}
                />
              ) : (
                <MaterialIcon
                  name="mic-none"
                  color={colors.primaryBackground}
                  style={styles.icon}
                  onPress={muteAudioLocalTrack}
                />
              )}
            </View>
          )}
          {userRole === USER_ROLE.LISTENER && (
            <View>
              <MaterialIcon
                name="mic-off"
                color={colors.redIcon}
                style={styles.iconMuted}
              />
            </View>
          )}
          <View style={styles.buttonContainer}>
            <RaisedButton
              buttonText={buttonText}
              onPressHandler={handleSubmit}
              disabled={loading}
            />
          </View>
          {accessDenied && (
            <SnackbarBox
              notification={{
                message: 'Conference access denied by moderator',
                background: colors.redBackground,
              }}
            />
          )}
        </StyledView>
      </ScrollView>
    </BodyView>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: SIZES.h3,
    textAlign: 'center',
    fontWeight: '700',
    color: colors.secondaryText,
    paddingBottom: 20,
  },
  subHeading: {
    fontWeight: '400',
    fontSize: SIZES.p4,
    textAlign: 'center',
    color: colors.secondaryText,
  },
  inputContainer: {
    marginTop: 50,
    marginBottom: 30,
  },
  input: {
    paddingBottom: 0,
  },
  iconContainer: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 30,
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: colors.primaryBackground,
    borderRadius: 50,
    width: 50,
    height: 50,
    textAlign: 'center',
    paddingTop: 10,
  },
  iconMuted: {
    fontSize: 30,
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: colors.redBorder,
    borderRadius: 50,
    width: 50,
    height: 50,
    textAlign: 'center',
    paddingTop: 10,
  },
  buttonContainer: {
    marginVertical: 30,
  },
});
