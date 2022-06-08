import * as React from 'react';
import {useEffect, useLayoutEffect, useState} from 'react';
import {
  TextInput,
  Button,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DropDownPicker from 'react-native-dropdown-picker';
import {DetailsScreen} from "./components/DetailsScreen";
import {initializeFirebase, setupGeoListener, writeGeoData} from "./helpers/firebaseHelper";

// import DetailsScreen from './components/DetailsScreen'
// import HomeScreen from './components/HomeScreen'

function Calculator({ navigation, route }) {
  var V8 = 0;
  var V9 = 0;

  useEffect(() => {
      try {
          initializeFirebase();
      } catch (err) {
          console.log(err)
      }
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button
            style={styles.titleText}
            onPress={() => {
                openHistory();
            }}
            title="History"
        />
      ),
      headerRight: () => (
        <Button
          style={styles.titleText}
          onPress={() =>
            navigation.navigate('Settings', {
              dunit: global.distCurrent,
              bunit: global.bearCurrent,
            })
          }
          title="Settings"
        />
      ),
    });
  }, [navigation]);

  function openHistory() {
      navigation.navigate('Details');
      console.log(V1 + ' - ' + V2);
  }

  // V8 = navigation.getParam('dunit', {});
  // V9 = navigation.getParam('bunit', {});

  function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  // Converts from radians to degrees.
  function toDegrees(radians) {
    return (radians * 180) / Math.PI;
  }

  // Computes d between two geo coordinates in kilometers.
  function computeDistance(lat1, lon1, lat2, lon2) {
    console.log(`p1={${lat1},${lon1}} p2={${lat2},${lon2}}`);
    var R = 6371; // km (change this constant to get miles)
    var dLat = ((lat2 - lat1) * Math.PI) / 180;
    var dLon = ((lon2 - lon1) * Math.PI) / 180;
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return `${round(d, 3)}`;
  }

  function milesDistance(kms) {
    return `${round(parseFloat(kms) * 0.621371, 3)}`;
  }

  function milsBearing(degrees) {
    return `${round(parseFloat(degrees) * 17.777778, 3)}`;
  }

  // Computes b between two geo coordinates in degrees.
  function computeBearing(startLat, startLng, destLat, destLng) {
    startLat = toRadians(startLat);
    startLng = toRadians(startLng);
    destLat = toRadians(destLat);
    destLng = toRadians(destLng);
    var y = Math.sin(destLng - startLng) * Math.cos(destLat);
    var x = 6;
    Math.cos(startLat) * Math.sin(destLat) -
      Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    var brng = Math.atan2(y, x);
    brng = toDegrees(brng);
    var d = (brng + 360) % 360;
    var res = `${round(d, 3)} `;
    return res;
  }

  function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
  }

  function submitText() {
    setLongitude1('');
    setLatitude1('');
    setLongitude2('');
    setLatitude2('');
    setDistance('');
    setBearing('');
    setError('');
  }
  const [latitude1, setLatitude1] = useState('');
  const [longitude1, setLongitude1] = useState('');
  const [latitude2, setLatitude2] = useState('');
  const [longitude2, setLongitude2] = useState('');
  const [d, setDistance] = useState('');
  const [b, setBearing] = useState('');
  const [error, setError] = useState('');

  var V1 = latitude1;
  var V2 = longitude1;
  var V3 = latitude2;
  var V4 = longitude2;
  var V5 = d;
  var V6 = b;
  var V7 = error;


  useEffect(async () => {
    const historyItem = route.params?.historyItem;
    if (historyItem) {
      setLongitude1(historyItem.ln1);
      setLatitude1(historyItem.lt1);
      setLongitude2(historyItem.ln2);
      setLatitude2(historyItem.lt2);
      V1 = historyItem.lt1;
      V2 = historyItem.ln1;
      V3 = historyItem.lt2;
      V4 = historyItem.ln2;
      console.log({V1, V2, V3, V4})
      await doCompute()
    }}, [route.params?.historyItem]);

    function doCompute() {
        setDistance(
            global.distCurrent == 0
                ? computeDistance(V1, V2, V3, V4)
                : milesDistance(
                    computeDistance(V1, V2, V3, V4)
                )
        );
        setBearing(
            global.bearCurrent == 0
                ? computeBearing(V1, V2, V3, V4)
                : milsBearing(
                    computeBearing(V1, V2, V3, V4)
                )
        );
    }

    return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Latitude Point1"
        value={V1}
        onChangeText={(V1) => {
          if (!isNaN(V1)) {
            setLatitude1(V1);
            setError('');
          } else {
            setLatitude1('');
            setError('Check number ');
          }
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Longitude Point1"
        value={V2}
        onChangeText={(V2) => {
          if (!isNaN(V2)) {
            setLongitude1(V2);
            setError('');
          } else {
            setLongitude1('');
            setError('Check number ');
          }
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Latitude Point2"
        value={V3}
        onChangeText={(V3) => {
          if (!isNaN(V3)) {
            setLatitude2(V3);
            setError('');
          } else {
            setLatitude2('');
            setError('Check number ');
          }
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Longitude Point2"
        value={V4}
        onChangeText={(V4) => {
          if (!isNaN(V4)) {
            setLongitude2(V4);
            setError('');
          } else {
            setLongitude2('');
            setError('Check number ');
          }
        }}
      />

      <TextInput style={styles.error} editable={false} value={V7} />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => {
          // if (V1 === V2){
          //   Alert.alert('Done')
          // }

          if (V1 != '' && V2 != '' && V3 != '' && V4 != '') {
            // Alert.alert(computeDistance(V1,V2,V3,V4) + "   "+ computeBearing(V1,V2,V3,V4))
              writeGeoData({lt1: V1, ln1: V2, lt2: V3, ln2: V4, date: (new Date()).toString()});
              doCompute();
          } else {
            setError('Check number Enter All Values');
          }
        }}>
        <Text>Calculate</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={submitText}>
        <Text>Clear</Text>
      </TouchableOpacity>

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          maxHeight: 40,
          borderColor: 'black',
          borderWidth: 1,
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            borderColor: 'black',
            borderWidth: 1,
          }}>
          <TextInput
            style={styles.text}
            editable={false}
            value={'Distance :'}
          />
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            borderColor: 'black',
            borderWidth: 1,
          }}>
          <TextInput
            style={styles.text}
            editable={false}
            value={
              V5 != ''
                ? global.distCurrent == 0
                  ? V5 + ' Kilometers'
                  : V5 + ' Miles'
                : ''
            }
          />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          maxHeight: 40,
          borderColor: 'black',
          borderLeftWidth: 1,
          borderTopWidth: 0,
          borderBottomWidth: 1,
          borderEndWidth: 1,
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            borderColor: 'black',
            borderLeftWidth: 1,
            borderTopWidth: 0,
            borderBottomWidth: 1,
            borderEndWidth: 1,
          }}>
          <TextInput
            style={styles.text}
            editable={false}
            value={'Bearing :'}
          />
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            borderColor: 'black',
            borderLeftWidth: 1,
            borderTopWidth: 0,
            borderBottomWidth: 1,
            borderEndWidth: 1,
          }}>
          <TextInput
            style={styles.text}
            editable={false}
            value={
              V6 != ''
                ? global.bearCurrent == 0
                  ? V6 + ' Degrees'
                  : V6 + ' Mils'
                : ''
            }
          />
        </View>
      </View>
    </View>
  );
}

function Settings({ route, navigation }) {
  const { dunit, bunit } = route.params;

  const [d, setDistance] = useState('');
  const [b, setBearing] = useState('');
  var V1 = d;
  var V2 = b;

  var x = dunit;
  var y = bunit;

  var cancelA = global.distCurrent;
  var cancelB = global.bearCurrent;

  V1 = x;
  V2 = y;

  function goBack() {
    // navigation.goBack();

    navigation.navigate('Calculator', {
      dunit: V1,
      bunit: V2,
    });
    console.log(V1 + ' - ' + V2);
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button
          style={styles.titleText}
          onPress={() => {
            goBack();
          }}
          title="Save"
        />
      ),
      headerRight: () => (
        <Button
          style={styles.titleText}
          onPress={() => {
            navigation.goBack();
            global.distCurrent = cancelA;
            global.bearCurrent = cancelB;
          }}
          title="Cancel"
        />
      ),
    });
  }, [navigation]);
  return (
    <View style={styles.container2}>
      <Text> d Units:</Text>
      <DropDownPicker
        items={[
          { label: 'kilometers', value: 0 },
          { label: 'miles', value: 1 },
        ]}
        defaultIndex={x}
        containerStyle={{ height: 40, width: '100%', marginVertical: 5 }}
        onChangeItem={(item) => {
          (V1 = item.value), (global.distCurrent = item.value);
        }}
      />
      <Text style={{ marginVertical: 5 }}> b Units:</Text>
      <DropDownPicker
        items={[
          { label: 'degrees', value: 0 },
          { label: 'mils', value: 1 },
        ]}
        defaultIndex={y}
        containerStyle={{ height: 40, width: '100%', marginVertical: 5 }}
        onChangeItem={(item) => {
          (V2 = item.value), (global.bearCurrent = item.value);
        }}
      />
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  global.distCurrent = 0;
  global.bearCurrent = 1;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        headerMode="float"
        screenOptions={
          ({ headerTitleAlign: 'center' },
          {
            headerStyle: { backgroundColor: '#24A0ED' },
            headerTitleStyle: { color: 'white', flex: 1, textAlign: 'center' },
          })
        }>
        <Stack.Screen
          name="Calculator"
          component={Calculator}
          options={{ headerTitleAlign: 'center' }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ headerTitleAlign: 'center' }}
          // navigationOptions= { header= {left = null }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{ headerTitleAlign: 'center' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 15,
    backgroundColor: '#FFFFFF',
    paddingRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ffffff',
    padding: 15,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    width: '100%',
    marginVertical: 5,
    marginHorizontal: 10,
    color: '#000000',
  },
  submitButton: {
    backgroundColor: '#24A0ED',
    padding: 10,
    margin: 5,
    width: '100%',
    height: 40,
    textAlign: 'center',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  text: {
    width: '100%',
    marginVertical: 5,
    marginHorizontal: 10,
    color: '#000000',
  },
  error: {
    width: '100%',
    marginVertical: 5,
    marginHorizontal: 10,
    color: '#ff0000',
  },

  titleText: {
    width: '100%',
    marginVertical: 5,
    marginHorizontal: 10,
    color: '#ffffff',
    elevation: 0,
  },
});
