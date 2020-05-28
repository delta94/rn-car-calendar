import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, StatusBar } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { TextInput, FAB, List as ListItem } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';

let Dates;
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    headerText: '#fff'
  },
};

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('@Dates');
    value ? Dates = value : Dates = {};
    console.log(Dates);
  } catch(e) {
    // error reading value
  }
}
getData();

const storeData = async (value) => {
  try {
    await AsyncStorage.setItem('@Dates', value);
    console.log(value)
  } catch (e) {
    // saving error
  }
}


function OpenList(navigation, day) {
  console.log(day);
  navigation.navigate('List', day);
}

function HomeScreen({ navigation }) {
  navigation.setOptions({
    headerStyle: {
      backgroundColor: theme.colors.primary,
    },
    headerTintColor: theme.colors.headerText,
  });

  return (
    <View style={styles.container}>
      <Calendar style={styles.calendar} onDayPress={(day) => { OpenList(navigation, day); }} minDate={Date()} firstDay={1} renderArrow={(direction) => <Icon name={"chevron-" + direction} size={30} />}
      />
    </View>
  )
}

function List({ route, navigation }) {
  const day = route.params;
  navigation.setOptions({
    headerTitle: day.dateString,
    headerStyle: {
      backgroundColor: theme.colors.primary,
    },
    headerTintColor: theme.colors.headerText,
  });

  return (
    <View style={styles.container}>
      <ListItem.Item
        title="First Item"
        description="Item description"
        left={props => <ListItem.Icon {...props} icon="car" />}
        onPress={() => console.log('TEST')}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  )
}

function Details({ navigation }) {
  navigation.setOptions({
    headerStyle: {
      backgroundColor: theme.colors.primary,
    },
    headerTintColor: theme.colors.headerText,
  });
  
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [licensePlate, setLicensePlate] = useState(getData('@license-plate'));
  const [brand, setBrand] = useState(getData('@brand'))
  const [model, setModel] = useState(getData('@model'))

  const dateToString = (date) => {
    let day;
    let month;
    let year = date.getFullYear();
    date.getDate().toString().length === 1 ? day = '0' + date.getDate().toString() : day = date.getDate().toString();
    date.getMonth().toString().length === 1 ? month = '0' + (date.getMonth() + 1).toString() : month = (date.getMonth() + 1).toString();
    console.log(`${day}-${month}-${year}`);
    return `${day}-${month}-${year}`;
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    console.log(currentDate);
   
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <View style={styles.container}>
      <TextInput label='Plaka' onChange={(event) => setLicensePlate(event.nativeEvent.text)} defaultValue={licensePlate} />
      <TextInput label='Marka' onChange={(event) => setBrand(event.nativeEvent.text)} defaultValue={brand} />
      <TextInput label='Model' onChange={(event) => setModel(event.nativeEvent.text)} defaultValue={model} />
      <ListItem.Item
        title="Alım Tarihi"
        description={dateToString(date)}
        left={props => <ListItem.Icon {...props} icon="calendar" />}
        onPress={() => showDatepicker()} />

      <FAB
        style={styles.fab}
        icon="content-save"
        label="Kaydet"
        onPress={() => console.log('Pressed')}
      />

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          timeZoneOffsetInMinutes={0}
          value={date}
          mode={'date'}
          is24Hour={true}
          display="default"
          onChange={onChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  )
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar translucent backgroundColor="rgba(0,0,0,0.2)" barStyle='light-content' />
        <Stack.Navigator>
          <Stack.Screen name="Calendar" component={HomeScreen} />
          <Stack.Screen name="List" component={List} />
          <Stack.Screen name="Details" component={Details} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  calendar: {
    width: '100%',
    height: '100%',
  },

  saveBtn: {
    width: '30%',
    alignSelf: 'center',
    marginTop: 50
  },

  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },

});
