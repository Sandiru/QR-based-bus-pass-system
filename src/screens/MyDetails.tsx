import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import {Button} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from '../components/navigationBar';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {doc, getDoc} from 'firebase/firestore';
import {db3} from '../../firebase/firebaseinitPassengers';

const MyDetails = (a: any) => {
  const stack = a.navigation;
  const {userId, userAmount} = a.route.params;
  const [state, setState] = useState('');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [iD, setID] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fecthData = async () => {
      try {
        setIsLoading(true);
        if (userId) {
          const snapshot = await getDoc(doc(db3, 'Users', userId));
          const userDetails = snapshot.data();
          if (userDetails) {
            const {
              account_state,
              amount,
              birthday,
              email,
              user_id,
              name,
              nick_name,
              phone_no,
            } = userDetails;
            setState(account_state);
            setName(name);
            setBirthday(birthday);
            setPhoneNumber(phone_no);
            setEmail(email);
            setID(user_id);
          }
        } else {
          Alert.alert('Error', 'Your not a Registered user!');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fecthData();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
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
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <ActivityIndicator size={80} color="#0000ff" />
        </View>
      </Modal>
      <HeaderMyDetails />
      <SafeAreaView>
        <ScrollView>
          <Balance amount={userAmount} stack={stack}/>

          <Details
            userId={userId}
            name={name}
            birthday={birthday}
            phoneNumber={phoneNumber}
            email={email}
            id={iD}
            stack={stack}
          />
        </ScrollView>
      </SafeAreaView>
      <NavigationBar routeName={a.route.name} stack={stack} />
    </View>
  );
};

const HeaderMyDetails = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        padding: '2%',
        paddingBottom: '4%',
        alignItems: 'center',
        marginTop: '2%',
        borderBottomWidth: 1,
        borderBottomColor: '#D9D9D9',
        height: 100,
      }}>
      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: 100,
          paddingTop: '3%',
        }}>
        <Icon size={20} name={'arrow-back'} />
      </View>

      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 25,
            fontFamily: 'Montserrat-Bold',
            color: '#747FFD',
            paddingTop: '4%',
          }}>
          My Details
        </Text>
      </View>

      <View
        style={{
          width: 30,
          height: 30,
          alignSelf: 'flex-start',
        }}>
        <Icon color={'#747FFD'} size={35} name={'menu'} />
      </View>
    </View>
  );
};

const Balance = (p: any) => {

  function GoToReload(){
    p.stack.navigate('Reload');
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        borderBottomWidth: 1,
        borderBottomColor: '#D9D9D9',
        height: 150,
      }}>
      <View
        style={{
          width: '60%',
          justifyContent: 'center',
          paddingLeft: '10%',
        }}>
        <View>
          <Text
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 20,
              color: '#000000',
            }}>
            {' '}
            Total balance{' '}
          </Text>
        </View>
        <View>
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: 20,
              color: '#000000',
            }}>
            Rs.
            {p.amount}.00
          </Text>
        </View>
        <View
          style={{
            marginTop: 7,
          }}>
          <Button title={'Reload'} color={'#747ffd'} onPress={GoToReload}/>
        </View>
      </View>

      <View
        style={{
          width: '35%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View>
          <Image
            style={{
              width: 90,
              height: 90,
              borderColor: '#747FFD',
              borderWidth: 3,
              borderRadius: 100,
            }}
            source={require('../../assets/img/app_background.png')}
          />
        </View>

        <View
          style={{
            width: 30,
            height: 30,
            backgroundColor: '#747FFD',
            marginRight: 25,
            borderRadius: 100,
            justifyContent: 'center',
            position: 'relative',
            alignSelf: 'flex-end',
          }}>
          <Icon size={15} color={'white'} name={'pencil'} />
        </View>
      </View>
    </View>
  );
};

const Details = (p: any) => {
  function GoToGetQR() {
    p.stack.navigate('QRCodeDownload', {userId: p.userId, name: p.name,user:p.id});
  }

  return (
    <View
      style={{
        marginTop: 20,
        marginBottom: 250,
      }}>
      <View>
        <View
          style={{
            height: 50,
            marginHorizontal: 30,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 16,
              fontFamily: 'Poppins-Regular',
            }}>
            Name{' '}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 20,
            height: 40,
            marginHorizontal: 30,
            justifyContent: 'center',
            paddingLeft: 20,
            borderWidth: 1,
            borderColor: '#E8E8E8',
          }}>
          <Text style={styles.text}>{p.name}</Text>
        </View>
      </View>

      <View>
        <View
          style={{
            height: 50,
            marginHorizontal: 30,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 16,
              fontFamily: 'Poppins-Regular',
            }}>
            Birthday{' '}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 20,
            height: 40,
            marginHorizontal: 30,
            justifyContent: 'center',
            paddingLeft: 20,
            borderWidth: 1,
            borderColor: '#E8E8E8',
          }}>
          <Text style={styles.text}>{p.birthday}</Text>
        </View>
      </View>

      <View>
        <View
          style={{
            height: 50,
            marginHorizontal: 30,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 16,
              fontFamily: 'Poppins-Regular',
            }}>
            Phone number{' '}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 20,
            height: 40,
            marginHorizontal: 30,
            justifyContent: 'center',
            paddingLeft: 20,
            borderWidth: 1,
            borderColor: '#E8E8E8',
          }}>
          <Text style={styles.text}>{p.phoneNumber}</Text>
        </View>
      </View>

      <View>
        <View
          style={{
            height: 50,
            marginHorizontal: 30,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 16,
              fontFamily: 'Poppins-Regular',
            }}>
            Email{' '}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 20,
            height: 40,
            marginHorizontal: 30,
            justifyContent: 'center',
            paddingLeft: 20,
            marginTop: '0%',
            borderWidth: 1,
            borderColor: '#E8E8E8',
          }}>
          <Text style={styles.text}>{p.email}</Text>
        </View>
      </View>
      <View>
        <View
          style={{
            height: 50,
            marginHorizontal: 30,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 16,
              fontFamily: 'Poppins-Regular',
            }}>
            User ID{' '}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 20,
            height: 40,
            marginHorizontal: 30,
            justifyContent: 'center',
            paddingLeft: 20,
            borderWidth: 1,
            borderColor: '#E8E8E8',
          }}>
            <Text style={styles.text}>{p.id}</Text>
          </View>
      </View>
      <View
        style={{
          marginTop: 20,
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={GoToGetQR}>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Get My QR Code</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MyDetails;

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 20,
    backgroundColor: 'rgba(58, 64, 240,1)',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    paddingHorizontal: 50,
  },
  text: {
    color: 'black',
  },
});
