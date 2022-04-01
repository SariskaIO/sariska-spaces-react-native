import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Overlay} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {colors} from '../../../assets/styles/_colors';
import {USER_ROLE} from '../../../constants';
import {RaisedButton} from '../RaisedButton';

const SettingsMenu = ({share, setShare, handleShare}) => {
  const [copySuccessCoHost, setCopySuccessCoHost] = React.useState(
    'Copy to Invite Co-host',
  );
  const [copySuccessSpeaker, setCopySuccessSpeaker] = React.useState(
    'Copy to Invite Speaker',
  );
  const [copySuccessListener, setCopySuccessListener] = React.useState(
    'Copy to Invite Listener',
  );
  const profile = useSelector(state => state.profile);
  // const handleTweet = () => {
  //     if (profile.subRole === USER_ROLE.HOST || profile.subRole === USER_ROLE.CO_HOST) {
  //       window.open('https://twitter.com/compose/tweet', '_blank');
  //     }
  //     setAnchorEl(null)
  //   }

  //   const handleDM = () => {
  //     if (profile.subRole === USER_ROLE.HOST || profile.subRole === USER_ROLE.CO_HOST) {
  //       window.open('https://twitter.com/messages', '_blank');
  //     }
  //     setAnchorEl(null)
  //   }

  function copyText(role, text) {
    Clipboard.setString(text);

    if (role === USER_ROLE.CO_HOST) {
      setCopySuccessCoHost('Copy CoHost Again');
    }

    if (role === USER_ROLE.SPEAKER) {
      setCopySuccessSpeaker('Copy Speaker Again');
    }

    if (role === USER_ROLE.LISTENER) {
      setCopySuccessListener('Copy Listener Again');
    }
  }

  const handleClose = () => {
    setShare(null);
    setCopySuccessCoHost('Copy to Invite Co-host');
    setCopySuccessSpeaker('Copy to Invite Speaker');
    setCopySuccessListener('Copy to Invite Listener');
  };

  return (
    <Overlay
      isVisible={share}
      onBackdropPress={handleShare}
      backdropStyle={{padding: 30, backgroundColor: colors.gray6Background}}
      overlayStyle={{
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        backgroundColor: colors.gray4Background,
      }}>
      <View style={styles.buttonContainer}>
        <RaisedButton
          buttonText={copySuccessCoHost}
          onPressHandler={() =>
            copyText(
              USER_ROLE.CO_HOST,
              `https://spaces.sariska.io/${profile.spaceTitle}?spacetype=${profile.spaceType}&role=${USER_ROLE.CO_HOST}`,
            )
          }
          disabled={
            profile.subRole === USER_ROLE.CO_HOST ||
            profile.subRole === USER_ROLE.SPEAKER ||
            profile.subRole === USER_ROLE.LISTENER
          }
        />
      </View>
      <View style={styles.buttonContainer}>
        <RaisedButton
          buttonText={copySuccessSpeaker}
          onPressHandler={() =>
            copyText(
              USER_ROLE.SPEAKER,
              `https://spaces.sariska.io/${profile.spaceTitle}?&spacetype=${profile.spaceType}&role=${USER_ROLE.SPEAKER}`,
            )
          }
          disabled={
            profile.subRole === USER_ROLE.SPEAKER ||
            profile.subRole === USER_ROLE.LISTENER
          }
        />
      </View>
      <View style={styles.buttonContainer}>
        <RaisedButton
          buttonText={copySuccessListener}
          onPressHandler={() =>
            copyText(
              USER_ROLE.LISTENER,
              `https://spaces.sariska.io/${profile.spaceTitle}?&spacetype=${profile.spaceType}&role=${USER_ROLE.LISTENER}`,
            )
          }
        />
      </View>
    </Overlay>
  );
};

export default SettingsMenu;

const styles = StyleSheet.create({
  buttonContainer: {
    marginBottom: 5,
    marginTop: 5,
  },
});
