import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from '../components/navigationBar';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {doc, getDoc} from 'firebase/firestore';
import {db3} from '../../firebase/firebaseinitPassengers';
import Handler from '../../payhere';

const FundTransfer = (a: any) => {
  const stack = a.navigation;

  return (
    <View style={style1.fullpage}>
      <Top />

      <Details stack={stack} />
      <NavigationBar routeName={a.route.name} stack={stack} />
    </View>
  );
};

function Top() {
  return (
    <View style={style1.top}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity>
          <Icon size={30} name={'chevron-back'} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 5,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: '#747ffd',
            fontSize: 27,
            fontWeight: 600,
          }}>
          Fund Transfer
        </Text>
      </View>
      <View
        style={{
          backgroundColor: 'white',
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <TouchableOpacity>
          <Icon size={40} name={'menu'} color={'#747ffd'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
function Middle() {
  return (
    <View style={style1.middle}>
      <Text
        style={{
          fontSize: 20,
          color: 'black',
          fontWeight: 500,
          paddingBottom: 10,
        }}>
        Total Balance
      </Text>
      <Text style={{fontSize: 32, color: 'black', fontWeight: 600}}>Rs</Text>
    </View>
  );
}
function Details(p: any) {
  const [isScanned, setIsScanned] = useState(false);
  const [amount, setAmount] = useState('');
  const [isValid, setIsValid] = useState(false);

  const proceed = () => {
    if (amount != '' && isValid) {
      Handler(amount);
    }
  };

  const onSuccess = async (dataOutput: any) => {
    const {bounds, data, rawData, target, type} = dataOutput;
    try {
      setIsScanned(true);
      if (data) {
        const snapshot = await getDoc(doc(db3, 'Users', data));
        console.log(snapshot)
        if (snapshot.exists()) {
          const userStatus = snapshot.data()?.account_state;
          if (userStatus == 'Active') {
            setIsValid(true);
          } else {
            setIsScanned(false);
            Alert.alert(
              'Error',
              'Your account deactivated due to security resons.',
            );
          }
        } else {
          setIsScanned(false);
          Alert.alert('Error', 'Your not a Registered user!');
        }
      } else {
        setIsScanned(false);
        Alert.alert('Error', 'Scan process unsuccessful.');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  return (
    <View style={style1.details}>
      <Modal visible={isScanned} transparent={true} animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              height: '40%',
              width: '80%',
              borderRadius: 30,
            }}>
            <View
              style={{marginTop: 20, alignItems: 'flex-end', marginRight: 30}}>
              <TouchableOpacity onPress={() => setIsScanned(false)}>
                <Icon name="close" color={'black'} size={25} />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                color: 'blue',
                fontSize: 18,
                fontWeight: '600',
                marginTop: 20,
                marginBottom: 30,
                textAlign: 'left',
                marginHorizontal: 30,
              }}>
              Amount
            </Text>

            <View style={{flex: 1, marginBottom: 50}}>
              <SafeAreaView>
                <ScrollView>
                  <View style={style1.form}>
                    <TextInput
                      style={style1.input}
                      placeholder="100.00"
                      value={amount}
                      onChangeText={setAmount}
                      placeholderTextColor={'#7d7d85'}
                      cursorColor={'#606066'}
                    />
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity onPress={proceed}>
                      <View style={style1.buttonContainer}>
                        <Text style={style1.buttonText}>Confirm</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </SafeAreaView>
            </View>
          </View>
        </View>
      </Modal>
      <Text style={style1.qrText}>Scan Your QR code</Text>
      <View style={{flexDirection: 'row', marginTop: 50}}>
        <View style={{flex: 1}}></View>

        <QRCodeScanner
          onRead={onSuccess}
          reactivate={false}
          cameraStyle={{flex: 1, height: 300, width: 'auto'}}
        />
        <View style={{flex: 1}}></View>
      </View>
    </View>
  );
}

const style1 = StyleSheet.create({
  fullpage: {
    backgroundColor: 'white',
    flex: 1,
  },
  top: {
    flexDirection: 'row',
    marginTop: 20,
  },
  middle: {
    marginTop: 20,
    marginLeft: 20,
  },
  details: {
    marginTop: 100,
  },
  footer: {
    flex: 1,
  },
  textinput: {
    width: 350,
    marginTop: 20,
    marginBottom: 20,
    paddingLeft: 20,
    borderRadius: 40,
    color: 'black',
    borderBlockColor: 'black',
    borderWidth: 0.2,
  },
  qrText: {
    fontSize: 18,
    marginTop: 40,
    marginBottom: 30,
    color: 'black',
    textAlign: 'center',
  },
  form: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#747FFD',
    borderRadius: 25,
    marginHorizontal: 20,
    height: 50,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    color: 'black',
    marginLeft: 20,
  },
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
});

export default FundTransfer;
