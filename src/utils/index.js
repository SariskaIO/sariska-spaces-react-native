import AsyncStorage from '@react-native-async-storage/async-storage';
import {GENERATE_TOKEN_URL} from '../constants';

export async function getToken(name, isModerator) {
  const body = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apiKey: '27fd6f8080d512442a3694f461adb3986cda5ba39dbe368d75',
      user: {
        name,
        moderator: isModerator,
      },
    }),
  };

  try {
    const response = await fetch(GENERATE_TOKEN_URL, body);
    console.log('response', response, body);
    if (response.ok) {
      const json = await response.json();
      console.log('json', json);
      return json.token;
    } else {
      console.log(response.status);
    }
  } catch (error) {
    console.log('error', error);
  }
}

export const getUserById = (id, conference) => {
  if (id === conference.myUserId()) {
    return conference.getLocalUser();
  }
  return conference?.participants[id]?._identity?.user;
};

export const clearAllTokens = () => {
  Object.entries(AsyncStorage)
    .map(x => x[0])
    .filter(x => x.substring(0, 8) === 'sariska_')
    .map(x => AsyncStorage.removeItem(x));
};

export function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
