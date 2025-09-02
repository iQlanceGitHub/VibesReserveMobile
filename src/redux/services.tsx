
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {Platform} from 'react-native';
import {
  asyncData,
  checkConnectivity,
  getAuthToken,
  storeData,
} from '../utilis/appConstant';

export const fetchGet = async payload => {
  const res = await checkConnectivity();
  const authToken = await getAuthToken();

  const retrieveData = async key => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Error retrieving array:', e);
      return null;
    }
  };

  const retrievedData = await retrieveData('user_token');
  console.log('retrievedData----->', retrievedData);

  let headders = '';

  headders = {
    'Content-Type': 'application/json',
    current_role: 'user',
    datetime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
    device_type: Platform.OS == 'android' ? 'android' : 'ios',
    Authorization: 'Bearer ' + retrievedData,
  };
  console.log('fetchGet...', payload?.url, headders);

  if (res) {
    try {
      const response = await fetch(`${payload?.url}`, {
        method: 'GET',
        headers: headders,
      });
      if (response.status >= 200 && response.status <= 299) {
        const jsonResponse = await response.json();
        console.log('jsonResponse........success\n', jsonResponse);
        return Promise.resolve(jsonResponse);
      }
      const jsonResponse = await response.json();
      console.log('jsonResponse........error\n', jsonResponse);
      const error = jsonResponse.jsonResponse;
      if (jsonResponse?.message == 'Unauthorized user!') {
        console.log('Hello');
        storeData('signin', '');
        storeData('profile', '');
      }
      return Promise.reject(jsonResponse?.message);
    } catch (error) {
      return Promise.reject('Something went wrong\n' + error);
    }
  } else {
    return Promise.reject('No Internet');
  }
};

export const fetchPost = async payload => {
  console.log('fetchPost...', payload);
  const res = await checkConnectivity();
  const authToken = await getAuthToken();

  const retrieveData = async key => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Error retrieving array:', e);
      return null;
    }
  };

  const retrievedData = await retrieveData('signin');

  const retrievedToken = await retrieveData('user_token');

  console.log('retrievedData:------------------------->', retrievedData);

  console.log(retrievedData?.token);

  let headders = '';

  if (retrievedData?.token == '') {
    headders = {'Content-Type': 'application/json'};
  } else {
    if (retrievedToken != undefined) {
      headders = {
        'Content-Type': 'application/json',
        current_role: 'user',
        datetime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
        device_type: Platform.OS == 'android' ? 'android' : 'ios',
        Authorization: `Bearer ${retrievedToken}`,
      };
    } else {
      headders = {
        'Content-Type': 'application/json',
        current_role: 'user',
        datetime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
        device_type: Platform.OS == 'android' ? 'android' : 'ios',
        Authorization: `Bearer ${retrievedData?.token}`,
      };
    }
  }
  if (res) {
    try {
      console.log('passed headders', headders);
      const response = await fetch(`${payload?.url}`, {
        method: 'POST',
        headers: headders,
        body: JSON.stringify(payload?.params),
      });
      if (response.status >= 200 && response.status <= 299) {
        const jsonResponse = await response.json();
        console.log('jsonResponse........success\n', jsonResponse);
        return Promise.resolve(jsonResponse);
      }
      const jsonResponse = await response.json();
      console.log('jsonResponse........error\n', jsonResponse);
      const error = jsonResponse.message;
      if (jsonResponse?.message == 'Unauthorized user!') {
        console.log('Hello');
        storeData(asyncData.SIGNIN_DATA, '');
        storeData('signin', '');
        storeData('profile', '');
        // EventBus.getInstance().fireEvent("LogoutEvent", {
        // })
      }
      return Promise.reject(jsonResponse);
    } catch (error) {
      console.log('==================================== ERROR');
      console.log(error);
      console.log('==================================== ERROR');
      return Promise.reject('Something went wrong');
    }
  } else {
    return Promise.reject('No Internet');
  }
};
export const fetchDelete = async payload => {
  const res = await checkConnectivity();

  const retrieveData = async key => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Error retrieving data:', e);
      return null;
    }
  };

  const retrievedToken = await retrieveData('user_token');
  console.log('retrievedToken----->', retrievedToken);

  let headers = {
    'Content-Type': 'application/json',
    current_role: 'user',
    datetime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
    device_type: Platform.OS === 'android' ? 'android' : 'ios',
    Authorization: `Bearer ${retrievedToken}`,
  };

  console.log('fetchDelete...', payload?.url, headers);

  if (res) {
    try {
      const response = await fetch(`${payload?.url}`, {
        method: 'DELETE',
        headers: headers,
      });

      const jsonResponse = await response.json();

      if (response.status >= 200 && response.status <= 299) {
        console.log('jsonResponse........success\n', jsonResponse);
        return Promise.resolve(jsonResponse);
      }

      console.log('jsonResponse........error\n', jsonResponse);

      if (jsonResponse?.message === 'Unauthorized user!') {
        console.log('Unauthorized - clearing data');
        await storeData('signin', '');
        await storeData('profile', '');
      }

      return Promise.reject(jsonResponse?.message || 'Delete failed');
    } catch (error) {
      console.log('DELETE request error:', error);
      return Promise.reject('Something went wrong');
    }
  } else {
    return Promise.reject('No Internet');
  }
};
export const fetchPaymentProfilePost = async payload => {
  console.log('fetchPost...', payload);
  const isConnected = await checkConnectivity();

  if (!isConnected) {
    return Promise.reject('No Internet');
  }

  const headers = {
    'Content-Type': 'application/json',
    current_role: 'user',
  };

  try {
    console.log('payload:->>>:pay====', payload);

    const response = await fetch(payload.url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload.payload),
    });

    console.log('Response:pay', response);

    // Removing BOM character from response
    const responseBody = await response.text();
    const jsonResponse = JSON.parse(responseBody.replace(/^\ufeff/, ''));

    console.log('Response JSON:', jsonResponse);

    if (response.ok) {
      console.log('jsonResponse success:', jsonResponse);
      return Promise.resolve(jsonResponse);
    } else {
      console.log('jsonResponse error:', jsonResponse);

      if (jsonResponse?.messages?.message === 'Unauthorized user!') {
        console.log('Unauthorized user!');
        storeData(asyncData.SIGNIN_DATA, '');
        storeData(asyncData.PROFILE_DATA, '');
        // EventBus.getInstance().fireEvent("LogoutEvent", {
        // })
      }

      return Promise.reject(jsonResponse?.messages?.message || 'Unknown error');
    }
  } catch (error) {
    console.log('Error:', error);
    return Promise.reject('Something went wrong');
  }
};
export const fetchPut = async payload => {
  console.log('fetchPut...', payload);
  const res = await checkConnectivity();

  const retrieveData = async key => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error('Error retrieving array:', e);
      return null;
    }
  };

  const retrievedToken = await retrieveData('user_token');
  console.log('retrievedToken----->', retrievedToken);

  let headers = {
    'Content-Type': 'application/json',
    current_role: 'user',
    datetime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
    device_type: Platform.OS == 'android' ? 'android' : 'ios',
    Authorization: `Bearer ${retrievedToken}`,
  };

  console.log('passed headers', headers);

  if (res) {
    try {
      const response = await fetch(`${payload?.url}`, {
        method: 'PUT', // Changed to PUT
        headers: headers,
        body: JSON.stringify(payload?.params),
      });

      if (response.status >= 200 && response.status <= 299) {
        const jsonResponse = await response.json();
        console.log('jsonResponse........success\n', jsonResponse);
        return Promise.resolve(jsonResponse);
      }

      const jsonResponse = await response.json();
      console.log('jsonResponse........error\n', jsonResponse);

      if (jsonResponse?.message == 'Unauthorized user!') {
        console.log('Unauthorized - clearing data');
        await storeData('signin', '');
        await storeData('profile', '');
      }

      return Promise.reject(jsonResponse?.message || 'Update failed');
    } catch (error) {
      console.log('PUT request error:', error);
      return Promise.reject('Something went wrong');
    }
  } else {
    return Promise.reject('No Internet');
  }
};
