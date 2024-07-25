import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';

import BottomSheet from './BottomSheet';
import Icon from 'react-native-vector-icons/Ionicons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {deleteUser, signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../../firebase/firebaseinitPassengers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';

const LoginScreen = (a: any) => {
  const stack = a.navigation;
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('email');
        const storedPassword = await AsyncStorage.getItem('password');
        if (storedEmail && storedPassword) {
          setUserEmail(storedEmail);
          setPassword(storedPassword);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error loading credentials:', error);
      }
    };
    loadCredentials();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleRememberMe = async () => {
    try {
      if (rememberMe) {
        await AsyncStorage.setItem('email', userEmail);
        await AsyncStorage.setItem('password', password);
      } else {
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('password');
      }
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  };

  const handleForgotPassword = () => {
    setShowBottomSheet(true);
  };

  function GoToHome() {
    stack.navigate('Home');
  }

  function GoToSignUp() {
    stack.navigate('SignUp');
  }

  function AuthenticateUser() {
    setIsLogging(true);
    signInWithEmailAndPassword(auth, userEmail, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        if (user.emailVerified) {
          setIsVerified(true);
          setIsLogging(false);
          GoToHome();
        } else {
          setIsLogging(false);
          deleteUser(user);
          Alert.alert(
            'Error',
            'Your registation process is unsuccessful because your unable to verify your email',
          );
        }
        setIsVerified(user.emailVerified);
        // ...
      })
      .catch(error => {
        const errorCode = error.code;
        const alert = 'Error code : ' + errorCode.split('/')[1];
        Alert.alert('Error', alert);
        setIsLogging(false);
      });
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
      <View style={styles.rectangle}>
        <KeyboardAwareScrollView>
          <View style={styles.content}>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.signInText}>Sign in to Continue</Text>

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
                name="lock-closed-outline"
                size={20}
                color="#FFFFFF"
                style={styles.iconcontainer}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor={'#7d7d85'}
                cursorColor={'#606066'}
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                {showPassword ? (
                  <Icon
                    name="eye-off-outline"
                    size={20}
                    color="#000"
                    style={styles.eyeIcon}
                  />
                ) : (
                  <Icon
                    name="eye-outline"
                    size={20}
                    color="#000"
                    style={styles.eyeIcon}
                  />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <View style={styles.row}>
                <TouchableOpacity
                  onPressIn={() => setRememberMe(!rememberMe)}
                  onPressOut={toggleRememberMe}
                  style={styles.checkboxContainer}>
                  <View
                    style={[
                      styles.checkbox,
                      rememberMe && styles.checkedCheckbox,
                    ]}
                  />
                </TouchableOpacity>
                <Text style={styles.rememberText}>Remember me</Text>
                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgotText}>Forgot Password</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={AuthenticateUser}>
              <Text style={styles.loginButtonText}>LOGIN</Text>
            </TouchableOpacity>
            <Text style={styles.createAccountText}>Don't have account?</Text>
            <TouchableOpacity onPress={GoToSignUp}>
              <Text style={styles.createAccountText2}>
                Create a new account
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>

      {/* Bottom Sheet */}
      {showBottomSheet && <BottomSheet setStatus={setShowBottomSheet} />}
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
    marginTop: 70,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 150,
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
  welcomeText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 34,
    fontWeight: 'bold',
    color: '#747FFD',
  },
  signInText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    marginBottom: 40,
    color: '#747FFD',
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
  rememberText: {
    flex: 8,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#747FFD',
    marginLeft: 10,
  },
  forgotText: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#747FFD',
    marginRight: 10,
  },
  loginButton: {
    backgroundColor: '#747FFD',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 15,
    marginTop: 25,
  },
  loginButtonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#fff',
  },
  createAccountText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#747FFD',
    marginTop: 20,
  },
  createAccountText2: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#747FFD',
  },
  checkboxContainer: {
    flex: 1,
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#747FFD',
    borderRadius: 4,
  },
  checkedCheckbox: {
    backgroundColor: '#747FFD',
  },
});

export default LoginScreen;
