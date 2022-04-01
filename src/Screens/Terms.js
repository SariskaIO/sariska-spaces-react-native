import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../assets/styles/_colors';
import {SIZES} from '../assets/styles/font';
import {Lists} from '../components/shared/Lists';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {RaisedButton} from '../components/shared/RaisedButton';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {addLocalTrack} from '../store/actions/track';
import {USER_ROLE} from '../constants';
import BodyView from '../components/shared/BodyView';
import StyledView from '../components/shared/StyledView';
import SariskaMediaTransport from 'sariska-media-transport/dist/esm/SariskaMediaTransport';

export const Terms = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const profile = useSelector(state => state.profile);
  let spaceType = route.params?.spaceType;
  let userRole = route.params?.role || profile?.subRole;
  const dispatch = useDispatch();

  const options = {
    devices: ['audio'],
  };

  const createNewLocalTracks = async () => {
    const newLocalTracks = await SariskaMediaTransport.createLocalTracks(
      options,
    );
    console.log('new', newLocalTracks);
    newLocalTracks?.forEach(track => dispatch(addLocalTrack(track)));
  };

  const onPressHandler = () => {
    if (userRole !== USER_ROLE.LISTENER) {
      createNewLocalTracks();
    }

    if (
      route.params?.spaceId &&
      userRole !== undefined &&
      spaceType !== undefined
    ) {
      navigation.navigate('Start', {
        spaceId: route.params?.spaceId,
        spaceType,
        role: userRole,
      });
    } else if (route.params?.spaceId) {
      navigation.navigate('Start', {
        spaceType,
        role: userRole,
      });
    } else {
      navigation.navigate('Start');
    }
  };

  const listItems = [
    {
      icon: (
        <MaterialCommunityIcon
          name="earth"
          color={colors.primaryBackground}
          size={SIZES.iconL}
          style={styles.icon}
        />
      ),
      primary: 'Public Stage',
      secondary: 'Only Blocked Account can not join',
    },
    {
      icon: (
        <MaterialIcon
          name="speaker-group"
          color={colors.primaryBackground}
          size={SIZES.iconL}
          style={styles.icon}
        />
      ),
      primary: 'Add Unlimited Speakers',
      secondary: 'Invite as many Speakers as you wish',
    },
    {
      icon: (
        <MaterialIcon
          name="rule"
          color={colors.primaryBackground}
          size={SIZES.iconL}
          style={styles.icon}
        />
      ),
      primary: 'Personalise Your Stage',
      secondary: 'Mute any Speaker or remove any guest',
    },
  ];
  return (
    <BodyView>
      <StyledView>
        <Text style={styles.h1}>
          Set up Live Audio Conversations with Stage
        </Text>
        <View style={styles.list}>
          <Lists list={listItems} />
        </View>
        <View style={styles.buttonContainer}>
          <RaisedButton
            buttonText={"Let's Start"}
            onPressHandler={onPressHandler}
          />
        </View>
      </StyledView>
    </BodyView>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: SIZES.h3,
    textAlign: 'center',
    fontWeight: '700',
    color: colors.secondaryText,
    paddingBottom: 40,
  },
  list: {
    marginBottom: 40,
  },
  icon: {
    textAlign: 'center',
    padding: 2,
  },
  buttonContainer: {
    marginTop: 60,
  },
});
