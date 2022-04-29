import {useNavigation, useRoute} from '@react-navigation/native';
import React, { useState } from 'react';
import {Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {DialogBox} from '../DialogBox';

export const ReconnectDialog = ({open}) => {
  const [dialogOpen, setDialogOpen] = useState(open);
  const profile = useSelector(state => state.profile);
  const route = useRoute();
  const navigation = useNavigation();
  let spaceType = route.params?.spaceType;
  let userRole = route.params?.role || profile?.subRole;

  const handleClose = () => {
    navigation.navigate('Space', {
      spaceId: profile.spaceTitle,
      spaceType,
      role: userRole,
    });
    setDialogOpen(false);
  };
  return (
    <>
      {dialogOpen && (
        <DialogBox>
          <Text style={{fontWeight: '700', fontSize: 16}}>Disconnected</Text>
          <View>
            <Text>You have disconnected, Please reconnect again.</Text>
          </View>
          <View>
            <Button onPress={handleClose} title="Reconnect" type="clear" />
          </View>
        </DialogBox>
      )}
    </>
  );
};
