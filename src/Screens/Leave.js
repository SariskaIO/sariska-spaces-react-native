import {useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import BodyView from '../components/shared/BodyView';
import {RaisedButton} from '../components/shared/RaisedButton';
import StyledView from '../components/shared/StyledView';

export const Leave = () => {
  const route = useRoute();
  const navigation = useNavigation();
  console.log('naviga', route.params);
  const onPressRejoin = () => {
    navigation.navigate('Home', {spaceId: route.params?.spaceId});
  };

  const onPressHome = () => {
    navigation.navigate('Home');
  };
  return (
    <BodyView>
      <StyledView>
        <View style={{marginBottom: 10}}>
          <RaisedButton buttonText={'Rejoin'} onPressHandler={onPressRejoin} />
        </View>
        <View>
          <RaisedButton
            buttonText={'Go To Home'}
            onPressHandler={onPressHome}
          />
        </View>
      </StyledView>
    </BodyView>
  );
};
