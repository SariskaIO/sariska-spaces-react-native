import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Overlay} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../../../assets/styles/_colors';
import {RaisedButton} from '../../shared/RaisedButton';
import SettingsMenu from '../../shared/SettingsMenu';
import StyledIcon from '../../shared/StyledIcon';
import {localTrackMutedChanged} from '../../../store/actions/track';
import { Audio } from '../../shared/Audio';

const SpaceFooterAction = ({setLocalHandRaise}) => {
  const profile = useSelector(state => state.profile);
  const [raiseHand, setRaiseHand] = useState(false);
  const conference = useSelector(state => state.conference);
  const [share, setShare] = useState(false);
  const [audioTrack] = useSelector(state => state.localTrack);
  const remoteTracks = useSelector(state => state.remoteTrack);
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const startRaiseHand = () => {
    conference.setLocalParticipantProperty('handraise', 'start');
    setRaiseHand(true);
    setLocalHandRaise(true);
  };

  const stopRaiseHand = () => {
    conference.setLocalParticipantProperty('handraise', 'stop');
    setRaiseHand(false);
    setLocalHandRaise(false);
  };

  const handleSummary = () => {
    navigation.navigate('Summary');
  };

  const handleShare = () => {
    setShare(!share);
  };

  const muteAudioLocalTrack = async () => {
    await audioTrack?.mute();
    dispatch(localTrackMutedChanged());
  };

  const unmuteAudioLocalTrack = async () => {
    await audioTrack?.unmute();
    dispatch(localTrackMutedChanged());
  };

  return (
    <View style={styles.iconSet}>
      <View style={styles.audioIcon}>
        {profile.subRole === 'listener' ? (
          <MaterialIcon
            name="mic-off"
            color={colors.redIcon}
            style={styles.iconMuted}
          />
        ) : (
          <>
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
          </>
        )}
      </View>
      <StyledIcon
        name="ios-hand-right-outline"
        pressHandler={raiseHand ? stopRaiseHand : startRaiseHand}
        styles={{
          backgroundColor: raiseHand
            ? colors.primaryBackground
            : colors.gray1Background,
          color: colors.secondaryText,
        }}
      />
      <StyledIcon
        name="person-add-outline"
        pressHandler={handleSummary}
        styles={{
          backgroundColor: colors.gray1Background,
          color: colors.secondaryText,
        }}
      />
      <StyledIcon
        name="ios-share-social-outline"
        pressHandler={handleShare}
        styles={{
          backgroundColor: colors.gray1Background,
          color: colors.secondaryText,
        }}
      />
      <SettingsMenu
        share={share}
        setShare={setShare}
        handleShare={handleShare}
      />
      {Object.entries(remoteTracks).map(([key, value]) => (
        <Audio track={value?.find(track => track.isAudioTrack())} />
      ))}
    </View>
  );
};

export default SpaceFooterAction;

const styles = StyleSheet.create({
  buttonContainer: {
    marginBottom: 5,
    marginTop: 5,
  },
  iconSet: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: '20%',
    alignItems: 'center',
  },
  audioIcon: {
    marginRight: 'auto',
  },
  icon: {
    fontSize: 30,
    width: 50,
    height: 50,
    textAlign: 'center',
    paddingTop: 10,
  },
  iconMuted: {
    fontSize: 30,
    width: 50,
    height: 50,
    textAlign: 'center',
    paddingTop: 10,
  },
});
