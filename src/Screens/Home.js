import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import SariskaMediaTransport from 'sariska-media-transport/dist/esm/SariskaMediaTransport';
import BodyView from '../components/shared/BodyView';
import {RaisedButton} from '../components/shared/RaisedButton';
 
export const Home = () => {
  const [buttonText, setButtonText] = useState('Start a Stage');
  const navigation = useNavigation();
  const route = useRoute();
  const profile = useSelector(state => state.profile);
  let spaceType = route.params?.spaceType;
  let userRole = route.params?.role || profile?.subRole;
  SariskaMediaTransport.initialize();
  SariskaMediaTransport.setLogLevel(SariskaMediaTransport.logLevels.ERROR); //TRACE ,DEBUG, INFO, LOG, WARN, ERROR

  const onPressHandler = () => {
    if (
      route.params?.spaceId &&
      userRole !== undefined &&
      spaceType !== undefined
    ) {
      navigation.navigate('Terms', {
        spaceId: route.params?.spaceId,
        spaceType: spaceType,
        role: userRole,
      });
    } else if (route.params?.spaceId) {
      navigation.navigate('Terms', {spaceId: route.params?.spaceId});
    } else {
      navigation.navigate('Terms');
    }
  };

  console.log('pressedi', buttonText, route.params?.spaceId);
  useEffect(() => {
    if (route.params?.spaceId) {
      setButtonText('Join Stage');
      console.log('pressedo', buttonText, route.params?.spaceId);
    }
  }, []);

  return (
    <BodyView>
      <View>
        <RaisedButton buttonText={buttonText} onPressHandler={onPressHandler} />
      </View>
    </BodyView>
  );
};
