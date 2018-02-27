import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import BackgroundTimer from 'react-native-background-timer';
import Pusher from 'pusher-js/react-native';

import Header from './components/Header';

const GOOGLE_API_KEY = 'YOUR GOOGLE PROJECT API KEY';
const { Location, Permissions } = Expo;

var current_location_channel = null;

var location_status = false;

var interval_ms = 1800 * 100; // 1800 seconds = 30 minutes, times 100 to convert to milliseconds


BackgroundTimer.runBackgroundTimer(() => { 
  
  if(location_status == 'granted'){
    
    Location.getCurrentPositionAsync({
      enableHighAccuracy: true
    })
    .then((res) => {
     
      let { latitude, longitude } = res.coords;
      
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`)
      .then((response) => response.json())
      .then((responseJson) => {
        let addr = responseJson.results[0].formatted_address;
     
        current_location_channel.trigger('client-location', {
          addr: addr,
          lat: latitude,
          lng: longitude
        });

      })
      .catch((error) => {
        console.error(error);
      });
    });
  
  }
  
}, 
30000);



export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      unique_code: Math.random().toString(36).substring(7).toUpperCase()
    };

    this.pusher = null;
  }
 

  componentWillMount() {

    this.pusher = new Pusher('YOUR PUSHER APP KEY', {
      authEndpoint: 'YOUR PUSHER AUTH ENDPOINT',
      cluster: 'YOUR PUSHER APP CLUSTER',
      encrypted: true
    });

  }


  componentDidMount() { 
    try {
      Permissions.askAsync(Permissions.LOCATION).then(({ status }) => {
        location_status = status;
      });
    }catch(error){
      console.log('err: ', error);
    }
  
    current_location_channel = this.pusher.subscribe('private-current-location-' + this.state.unique_code);
  }


  render() {
    return (
      <View style={styles.container}>
        <Header text="OCDMom" />
        <View style={styles.body}>
          <Text style={styles.input_label}>Unique Code</Text>
          <Text style={styles.unique_code}>{this.state.unique_code}</Text>
        </View>
      </View>
    );
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#fff'
  },
  body: {
    flex: 18,
    padding: 10,
    marginTop: 20
  },
  input_label: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  unique_code: {
    fontWeight: 'bold',
    fontSize: 30
  }
});
