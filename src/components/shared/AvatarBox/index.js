import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Avatar} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {colors} from '../../../assets/styles/_colors';
import {USER_ROLE} from '../../../constants';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SIZES} from '../../../assets/styles/font';

const AvatarBox = ({
  role,
  isActiveSpeaker,
  participantDetails,
  localUserId,
  localHandRaise,
  onClick,
}) => {
  const avatarColors = useSelector(state => state.color);
  const {raisedHandParticipantIds} = useSelector(state => state.layout);

  let avatarColor = avatarColors[participantDetails?.id];
  const coHostOrSpeaker =
    role === USER_ROLE.SPEAKER ||
    role === USER_ROLE.HOST ||
    role === USER_ROLE.CO_HOST;
  console.log(
    'avatrta',
    participantDetails,
    localUserId,
    avatarColor,
    avatarColors,
    role,
  );
  return (
    <Pressable onPress={onClick} style={styles.container}>
      {participantDetails?.avatar ? (
        <Avatar
          source={{
            uri: participantDetails?.avatar,
          }}
          size="medium"
          rounded
          overlayContainerStyle={{
            backgroundColor: avatarColor
              ? avatarColor
              : colors.secondaryLightBackground,
          }}
        />
      ) : participantDetails?.name ? (
        <Avatar
          title={`${participantDetails?.name.slice(0, 1).toUpperCase()}`}
          size="medium"
          rounded
          titleStyle={{
            color: colors.whiteText,
            fontSize: 16,
            fontWeight: '700',
          }}
          overlayContainerStyle={{
            backgroundColor: avatarColor
              ? avatarColor
              : colors.secondaryLightBackground,
          }}
        />
      ) : null}
      <View style={styles.iconContainer}>
        {raisedHandParticipantIds[participantDetails?.id] && (
          <MaterialCommunityIcon
            name="hand-back-right-outline"
            style={styles.icon}
          />
        )}
      </View>
      {localHandRaise && localUserId === participantDetails?.id && (
        <View style={styles.iconContainer}>
          <MaterialCommunityIcon
            name="hand-back-right-outline"
            style={styles.icon}
          />
        </View>
      )}
      <View>
        <Text style={styles.name}>
          {localUserId === participantDetails?.id
            ? 'You'
            : participantDetails?.name}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: isActiveSpeaker
            ? colors.primaryBackground
            : colors.gray1Background,
          borderWidth: coHostOrSpeaker ? 1 : null,
          borderColor: coHostOrSpeaker
            ? colors.primaryBorder
            : colors.transparentBorder,
          borderRadius: 15,
          paddingVertical: 3,
          paddingHorizontal: 16,
          marginVertical: 8,
        }}>
        {/* { coHostOrSpeaker && <img src={img} alt="host" height="15px" width= '100%'/>} */}
        <Text style={styles.role}>{role}</Text>
      </View>
    </Pressable>
  );
};

export default AvatarBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 30,
    zIndex: 9999,
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    right: 25,
  },
  icon: {
    fontSize: 20,
    color: colors.primaryBackground,
    backgroundColor: colors.whiteBackground,
    borderRadius: 20,
  },
  name: {
    fontWeight: '700',
    color: colors.secondaryDarkText,
    fontSize: SIZES.p5,
  },
  roleContainer: {
    borderRadius: 15,
    paddingVertical: 3,
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  role: {
    fontWeight: '700',
    color: colors.secondaryText,
    textTransform: 'capitalize',
  },
});
