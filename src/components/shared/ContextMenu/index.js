import * as React from 'react';
import {View} from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import { colors } from '../../../assets/styles/_colors';

export const ContextMenu = ({
  contextMenu,
  handleContextMenu,
  handleClose,
  list,
  participantId,
  children,
}) => {
  console.log('party', participantId, list);
  return (
    <View style={{width: '33%'}}>
      <Menu opened={contextMenu !== false} onBackdropPress={handleContextMenu}>
        <MenuTrigger customStyles={triggerStyles}>{children}</MenuTrigger>
        <MenuOptions>
          {list?.length > 0 &&
            list.map((item, index) => (
              <MenuOption
                value={item.title}
                text={item.title}
                onSelect={() => handleClose(item.title, participantId)}
                key={index}
              />
            ))}
        </MenuOptions>
      </Menu>
    </View>
  );
};
const triggerStyles = {
  triggerTouchable: {
    activeOpacity: 1,
    style: {
      flex: 1,
    },
  },
};
