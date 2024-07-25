import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Button,
  Alert,
} from 'react-native';
import NavigationBar from '../components/navigationBar';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import {auth, db3} from '../../firebase/firebaseinitPassengers';
import {SafeAreaView} from 'react-native-safe-area-context';

const AddMembers = (a: any) => {
  const stack = a.navigation;
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [nickName, setNickName] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [isLogging, setIsLogging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [nameMap, setNameMap] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const fetchData = async () => {
      const map: {[key: string]: string} = {};
      for (const item of members) {
        const name = await fetchName(item);
        map[item] = name || ''; // Set the name in the map
      }
      setNameMap(map);
      setIsLoading(false);
    };
    fetchData();
  }, [members]); // Run effect when array changes

  const fetchName = async (item: string) => {
    try {
      const snapshot = await getDoc(doc(db3, 'Users', item));
      return snapshot.data()?.name || '';
    } catch (error) {
      console.error('Error fetching name for item:', item, error);
      return '';
    }
  };

  const handleAddMember = async (membersArray: [], id: string,user:string) => {
    const newMember = id;
    setMembers([...membersArray, newMember]);
    setFullName('');
    setEmail('');
    setPhoneNumber('');
    setBirthday(new Date());
    setNickName('');
    setDoc(
      doc(db3, 'Users', auth.currentUser?.uid ?? ''),
      {members: [...membersArray, id]},
      {merge: true},
    );

    setIsLogging(false);
    stack.navigate('QRCodeDownload', {userId: id, name: nickName,user:user});
  };

  const handleDeleteMember = (index: number) => {
    const updatedMembers = [...members];
    updatedMembers.splice(index, 1);
    setMembers(updatedMembers);
  };

  const handleRemoveMember = async (index: number) => {
    setIsLoading(true);
    setIsShow(false);
    const snapshot = await getDoc(
      doc(db3, 'Users', auth.currentUser?.uid ?? ''),
    );
    const updatedMembers = members;
    updatedMembers.splice(index, 1);
    setMembers(updatedMembers);
    setDoc(
      doc(db3, 'Users', auth.currentUser?.uid ?? ''),
      {members: updatedMembers},
      {merge: true},
    );
    setIsShow(true);
    setIsLoading(false);
  };

  function Main() {
    stack.navigate('Home');
  }

  async function UploadToDatabase() {
    setIsLoading(true);
    function isValidEmail(email: string) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    }

    if (
      fullName.length > 3 &&
      isValidEmail(email) &&
      phoneNumber &&
      birthday &&
      nickName
    ) {
      const getDocRef = await getDoc(doc(db3, 'UserIDs', 'AvailableID'));
      const userId = parseInt(getDocRef.data()?.id);
      const user =
        'P' + fullName[0].toUpperCase() + (fullName[2] == '' ? 'X' : fullName[2].toUpperCase()) + userId;
      await setDoc(
        doc(db3, 'UserIDs', 'AvailableID'),
        {id: userId + 1},
        {merge: true},
      );
      const docRef = await addDoc(collection(db3, 'Users'), {
        user_id: user,
        name: fullName,
        email: email,
        phone_no: phoneNumber,
        birthday: birthday.toDateString(),
        amount: 0,
        nick_name: nickName,
        account_state: 'Active',
      });
      addDoc(collection(db3, 'Users', docRef.id, 'Trips'), {});
      const snapshot = await getDoc(
        doc(db3, 'Users', auth.currentUser?.uid ?? ''),
      );
      if (snapshot.data()?.members) {
        handleAddMember(snapshot.data()?.members ?? [], docRef.id,user);
      } else {
        handleAddMember([], docRef.id,user);
      }
    } else {
      Alert.alert('Error', 'Your entered data is invalid.');
    }
    setIsLoading(false);
  }

  const fetchMembers = async () => {
    if (!isShow) {
      setIsLoading(true);
    }

    const snapshot = await getDoc(
      doc(db3, 'Users', auth.currentUser?.uid ?? ''),
    );
    if (snapshot.data()?.members) {
      const memberArray = snapshot.data()?.members;
      setMembers(memberArray);
    } else {
      setIsLoading(false);
    }
  };
  function GoToMenu() {
    stack.navigate('Back');
  }

  return (
    <View style={styles.container}>
      <Modal
        visible={isLogging}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {}}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <ActivityIndicator size={80} color="#0000ff" />
        </View>
      </Modal>
      <TouchableOpacity style={styles.settingsIcon} onPress={GoToMenu}>
        <Icon name="menu-outline" size={30} color="blue" />
      </TouchableOpacity>
      <Text style={styles.title}>Enter Your Details</Text>
      <View
        style={{
          borderBottomColor: '#bbc4c9',
          borderBottomWidth: 1,
          width: '100%',
        }}
      />
      <SafeAreaView>
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
                placeholderTextColor={'#7d7d85'}
                cursorColor={'#606066'}
              />
            </View>
            <TouchableOpacity onPress={() => setOpen(true)}>
              <DatePicker
                modal
                theme="light"
                mode="date"
                open={open}
                date={birthday}
                onConfirm={date => {
                  setOpen(false);
                  setBirthday(date);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
              <View style={styles.form}>
                <TextInput
                  style={styles.input}
                  editable={false}
                  placeholder="Birthday"
                  value={birthday.toDateString()}
                  placeholderTextColor={'#7d7d85'}
                  cursorColor={'#606066'}
                />
              </View>
            </TouchableOpacity>
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholderTextColor={'#7d7d85'}
                cursorColor={'#606066'}
              />
            </View>
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor={'#7d7d85'}
                cursorColor={'#606066'}
              />
            </View>
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Nick Name"
                value={nickName}
                onChangeText={setNickName}
                placeholderTextColor={'#7d7d85'}
                cursorColor={'#606066'}
              />
            </View>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={UploadToDatabase}>
              <Text style={styles.buttonText}>CONFIRM</Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.membersListTitle}>
                Recently Added Members
              </Text>
              <TouchableOpacity
                onPressIn={fetchMembers}
                onPressOut={() => setIsShow(!isShow)}
                style={styles.eyeIcon}>
                {isShow ? (
                  <Icon name="eye-off-outline" size={22} color="black" />
                ) : (
                  <Icon name="eye-outline" size={22} color="black" />
                )}
              </TouchableOpacity>
            </View>
            <View
              style={{
                borderBottomColor: '#bbc4c9',
                borderBottomWidth: 1,
                width: '100%',
              }}
            />
            <Modal
              visible={isLoading}
              transparent={true}
              animationType="fade"
              onRequestClose={() => {}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                }}>
                <ActivityIndicator size={80} color="#0000ff" />
              </View>
            </Modal>
            {isShow ? (
              <View style={styles.membersList}>
                {members.map((member, index) => (
                  <View key={index} style={styles.memberItem}>
                    <Icon
                      name="person-circle-outline"
                      size={40}
                      color="black"
                      style={styles.iconcontainer}
                    />
                    <Text style={styles.membersName}>{nameMap[member]}</Text>
                    <View style={styles.button}>
                      <Button
                        title="Remove"
                        color={'red'}
                        onPress={() => handleRemoveMember(index)}
                      />
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View></View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
      <NavigationBar routeName={a.route.name} stack={stack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    marginTop: 40,
    marginBottom: 250,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
    color: '#747FFD',
    textAlign: 'center',
  },
  settingsIcon: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  form: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#747FFD',
    borderRadius: 25,
    marginHorizontal: 20,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    color: 'black',
    marginLeft: 20,
  },
  confirmButton: {
    backgroundColor: '#747FFD',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  membersListTitle: {
    flex: 8,
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    marginBottom: 20,
    marginTop: 50,
    marginLeft: 20,
    color: 'black',
    fontWeight: '700',
    textAlign: 'left',
  },
  eyeIcon: {
    flex: 1,
    marginTop: 40,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    marginRight: 20,
  },
  membersList: {
    marginTop: 20,
  },
  memberItem: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: 'white',
    height: 80,
    borderRadius: 30,
    elevation: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  membersName: {
    flex: 3,
    color: 'black',
    fontSize: 18,
    marginVertical: 30,
    textAlign: 'left',
  },
  button: {
    flex: 2,
    marginHorizontal: 30,
    marginVertical: 20,
  },
  iconcontainer: {
    flex: 1,
    marginHorizontal: 30,
    marginVertical: 20,
  },
});

export default AddMembers;
