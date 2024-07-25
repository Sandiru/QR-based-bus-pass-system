import {doc, getDoc} from 'firebase/firestore';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {db3} from '../../firebase/firebaseinitPassengers';

const MembersMenu = (p: any) => {
  const array = p.nameArray;
  const placeholder = p.placeHolder;
  const onChange = p.setOnChange;
  const [nameMap, setNameMap] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const fetchData = async () => {
      const map: {[key: string]: string} = {};
      for (const item of array) {
        const name = await fetchName(item);
        map[item] = name || ''; // Set the name in the map
      }
      setNameMap(map);
    };
    fetchData();
  }, [array]); // Run effect when array changes

  const fetchName = async (item: string) => {
    try {
      const snapshot = await getDoc(doc(db3, 'Users', item));
      return snapshot.data()?.name || '';
    } catch (error) {
      console.error('Error fetching name for item:', item, error);
      return '';
    }
  };

  return (
    <View style={styles.container}>
      <SelectDropdown
        data={array}
        onSelect={onChange}
        renderButton={(selectedItem: any, isOpen: any) => {
          const selectedItemName = nameMap[selectedItem];
          return (
            <View style={styles.dropdownButtonStyle}>
              <Text style={styles.dropdownButtonTxtStyle}>
                {selectedItemName || nameMap[array[0]]}
              </Text>
            </View>
          );
        }}
        renderItem={(item: any, index: any, isSelected: any) => {
          const itemName = nameMap[item]; // Get the name from the map

          return (
            <View
              style={{
                ...styles.dropdownItemStyle,
                ...(isSelected && {backgroundColor: '#D2D9DF'}),
              }}>
              <Text style={styles.dropdownItemTxtStyle}>{itemName}</Text>
            </View>
          );
        }}
        dropdownStyle={styles.dropdownMenuStyle}
      />
    </View>
  );
};

export default MembersMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  header: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 90,
    backgroundColor: '#E9ECEF',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 16,
  },
  headerTxt: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#151E26',
  },
  dropdownButtonStyle: {
    width: 200,
    height: 30,
    backgroundColor: 'rgba(0,0,0,0)',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginRight:100
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: '#151E26',
    textAlign: 'left',
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownSearchInputStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#B1BDC8',
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#B1BDC8',
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
    textAlign: 'center',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  ////////////// dropdown1
  dropdown1ButtonStyle: {
    width: '80%',
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#444444',
  },
  dropdown1ButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  dropdown1ButtonArrowStyle: {
    fontSize: 28,
    color: '#FFFFFF',
  },
  dropdown1ButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
    color: '#FFFFFF',
  },
  dropdown1MenuStyle: {
    backgroundColor: '#444444',
    borderRadius: 8,
  },
  dropdown1SearchInputStyle: {
    backgroundColor: '#444444',
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
  },
  dropdown1ItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#B1BDC8',
  },
  dropdown1ItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  dropdown1ItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
    color: '#FFFFFF',
  },
});
