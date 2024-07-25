// App.tsx

import React, {useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import NavigationBar from '../components/navigationBar';
import Icon from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import {captureRef} from 'react-native-view-shot';
import RNFS from 'react-native-fs';

const QRCodeDownload = (a: any) => {
  const stack = a.navigation;
  const {userId, name,user} = a.route.params;
  const qrCodeRef = useRef(null);

  const saveQRCodeImage = async () => {
    try {
      // Capture the view containing the QR code
      const uri = await captureRef(qrCodeRef, {
        format: 'png',
        quality: 1,
      });

      // Get the download directory path
      const downloadDir = RNFS.DownloadDirectoryPath;

      // Construct the destination path
      const destinationPath = `${downloadDir}/qrcode.png`;

      // Move the captured image to the download directory
      await RNFS.moveFile(uri, destinationPath);

      console.log('QR code image saved at:', destinationPath);
    } catch (error) {
      console.error('Error saving QR code image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.settingsIcon}>
        <Icon name="menu-outline" size={30} color="blue" />
      </TouchableOpacity>
      <Text style={styles.title}></Text>
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
            <Text style={styles.title}>Hi</Text>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.qrText}>This is your QR code</Text>

            <View ref={qrCodeRef} style={styles.qrCode}>
              <QRCode
                value={userId}
                size={210}
                color="white"
                backgroundColor="#5358ed"
                logo={require('../../assets/img/qrcodelogo.png')}
                logoSize={30}
                logoBackgroundColor="white"
              />
            </View>
            <Text style={styles.qrIDText}>Your User ID: {user} </Text>
            <Text style={styles.qrBottomText}>{'(Please keep above id securly for future identification purposes.)'}</Text>
            <TouchableOpacity onPress={saveQRCodeImage}>
              <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Download</Text>
              </View>
            </TouchableOpacity>
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
    marginTop: 20,
    marginBottom: 250,
    justifyContent: 'center',
    alignItems:'center'
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#5358ed',
    textAlign: 'center',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#5358ed',
    textAlign: 'center',
  },
  qrText: {
    fontSize: 18,
    marginTop: 30,
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  qrIDText: {
    fontSize: 18,
    fontWeight:'600',
    marginTop: 40,
    color: 'red',
    textAlign: 'center',
  },
  qrBottomText: {
    fontSize: 14,
    marginBottom: 10,
    color: 'black',
    textAlign: 'center',
    marginHorizontal:20
  },
  settingsIcon: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  qrCode: {
    backgroundColor: '#5358ed',
    justifyContent: 'center',
    alignItems:'center',
    height: 270,
    width:270,
    borderRadius: 30,
    elevation: 5,
  },
  buttonContainer: {
    marginTop: 30,
    backgroundColor: 'rgba(58, 64, 240,1)',
    borderRadius: 20,
    height: 50,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    paddingHorizontal:80
  },
});

export default QRCodeDownload;
