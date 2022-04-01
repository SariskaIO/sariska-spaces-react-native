import {useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {DialogBox} from '../DialogBox';

export const ReconnectDialog = () => {
  const profile = useSelector(state => state.profile);
  const route = useRoute();
  const navigation = useNavigation();
  let spaceType = route.params?.spaceType;
  let userRole = route.params?.role || profile?.subRole;

  const handleClose = () => {
    navigation.navigate('Space', {
      spaceTitle: profile.spaceTitle,
      spaceType,
      role: userRole,
    });
  };
  return (
    <DialogBox>
      <Text>Disconnected</Text>
      <View>
        <Text>You have disconnected, Please reconnect again.</Text>
      </View>
      <View>
        <Button onPress={handleClose} title="Reconnect" type="clear" />
      </View>
    </DialogBox>
  );
};
