import {
  applyActionCode,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import {auth} from '../../firebase/firebaseinitPassengers';

const SignUpScreen = (a: any) => {
  const stack = a.navigation;
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };

  function GoToLogin() {
    stack.navigate('Login');
  }

  function Authentication() {
    createUserWithEmailAndPassword(auth, userEmail, password)
      .then(userCredential => {
        // Signed up
        const user = userCredential.user;
        VerificationEmail(user);
        Alert.alert('Alert', 'The verification link was send to your email');
        // ...
      })
      .catch(error => {
        const errorCode = error.code;
        const alert = 'Error code : ' + errorCode.split('/')[1];
        Alert.alert('Error', alert);
        // ..
      });
  }

  async function VerificationEmail(user: any) {
    const actionCodeSettings = {
      url: 'https://www.myapp.com/app.json',
      handleCodeInApp: true,
    };
    try {
      await sendEmailVerification(user, actionCodeSettings);
      const code = '1234';
      // Obtain code from the user.
      await applyActionCode(auth, code);
    } catch (error: any) {
      const errorCode = error.code;
      console.log(errorCode);
      // ..
    }
  }

  return (
    <View style={styles.container}>
      <Image
        style={{width: '100%', height: '100%', position: 'absolute'}}
        source={require('../../assets/img/app_background.png')}
        resizeMode="cover"
      />
      <Modal visible={isVisible} transparent={true} animationType="fade">
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
              height: '90%',
              width: '90%',
              borderRadius: 30,
            }}>
            <View
              style={{marginTop: 20, alignItems: 'flex-end', marginRight: 30}}>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Icon name="close" color={'black'} size={25} />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                color: '#3b3a69',
                fontSize: 22,
                fontWeight: '600',
                marginTop: 20,
                marginBottom: 30,
                textAlign: 'center',
                marginHorizontal: 30,
              }}>
              Welcome to QR Bus Pass System
            </Text>

            <View style={{flex: 1, marginBottom: 50}}>
              <SafeAreaView>
                <ScrollView>
                  <Text
                    style={{
                      color: 'black',
                      marginHorizontal: 40,
                      fontSize: 18,
                      textAlign: 'center',
                    }}>
                    Introducing QR Bus Pass System, the all in one solution for
                    comfortable bus travel. Our app facilitates the travel by
                    combining registration, payment, and fare calculation into
                    one user-friendly platform.{'\n\n'}
                    Registering for our app is effortless, simply create a new
                    account with a username and password. Upon registration,
                    passengers receive a unique QR code, serving as their
                    electronic bus pass.{'\n\n'}
                    Need to reload your account?🤔{'\n\n'} No problem!{'\n'} You
                    can easily do so using card payment or bank deposit. Our app
                    also offers facilities for fair calculation and fund
                    transfer. If you happen to lose your QR code, don't worry!
                    you can request a new one right here.{'\n\n'}
                    Say goodbye👋 to paper tickets{'\n'} Join us today and
                    enhance your bus travel experience with QR Bus Pass System.
                  </Text>
                </ScrollView>
              </SafeAreaView>
            </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        style={styles.settingsIcon}
        onPress={() => setIsVisible(true)}>
        <Icon name="help-circle-outline" size={30} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.rectangle}>
        <KeyboardAwareScrollView>
          <View style={styles.content}>
            <Text style={styles.CreateNewAccText1}>Create New</Text>
            <Text style={styles.CreateNewAccText2}>Account</Text>

            <View style={styles.inputContainer}>
              <Icon
                name="person-outline"
                size={20}
                color="#FFFFFF"
                style={styles.iconcontainer}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={userEmail}
                onChangeText={setUserEmail}
                placeholderTextColor={'#7d7d85'}
                cursorColor={'#606066'}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon
                name={'lock-closed-outline'}
                size={20}
                color="#FFFFFF"
                style={styles.iconcontainer}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                placeholderTextColor={'#7d7d85'}
                cursorColor={'#606066'}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Icon
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#000"
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer2}>
              <Icon
                name={'lock-closed-outline'}
                size={20}
                color="#FFFFFF"
                style={styles.iconcontainer}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={password2}
                onChangeText={setPassword2}
                placeholderTextColor={'#7d7d85'}
                cursorColor={'#606066'}
                secureTextEntry={!showPassword2}
              />
              <TouchableOpacity onPress={togglePasswordVisibility2}>
                <Icon
                  name={showPassword2 ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#000"
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.termsText}>
              {
                'By continuing, you agree with our Term &\n         Conditions and Privacy Policy'
              }
            </Text>
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={Authentication}>
              <Text style={styles.signUpButtonText}>SIGN UP</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={GoToLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <View style={{marginBottom:150}}></View>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rectangle: {
    borderTopRightRadius: 45,
    borderTopLeftRadius: 45,
    backgroundColor: '#FFFFFF',
    top: 120,
    flex: 2,
    marginTop: 50,
  },
  content: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  settingsIcon: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  CreateNewAccText1: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 34,
    fontWeight: 'bold',
    color: '#747FFD',
  },
  CreateNewAccText2: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 34,
    fontWeight: 'bold',
    color: '#747FFD',
    marginTop: -10,
    marginBottom: 50,
  },
  registeredText: {
    fontFamily: 'Poppins-Regular',
    color: '#747FFD',
    fontSize: 16,
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#747FFD',
    borderRadius: 25,
    paddingHorizontal: 10,
  },
  inputContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#747FFD',
    borderRadius: 25,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  eyeIcon: {
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
    width: '100%',
  },
  iconcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    backgroundColor: '#747FFD',
    borderRadius: 25,
    marginRight: 20,
    paddingLeft: 5,
    paddingTop: 3,
  },

  signUpButton: {
    backgroundColor: '#747FFD',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 15,
    marginTop: 25,
  },
  signUpButtonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#fff',
  },
  termsText: {
    alignSelf: 'center',
    color: '#747FFD',
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
  },
  login: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#747FFD',
  },
  loginButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#747FFD',
    textAlign: 'right',
    marginTop: 20,
    marginRight: 40,
  },
});

export default SignUpScreen;
