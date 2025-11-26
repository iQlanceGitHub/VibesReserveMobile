import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { Platform } from "react-native";
import {
  asyncData,
  checkConnectivity,
  getAuthToken,
  storeData,
} from "../utilis/appConstant";

export const fetchGet = async (payload) => {
  console.log("🔑 FETCH GET - payload:", payload?.url);

  const res = await checkConnectivity();
  const authToken = await getAuthToken();

  const retrieveData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue == null) return null;

      // Try to parse as JSON first, if it fails, return as string
      try {
        return JSON.parse(jsonValue);
      } catch (parseError) {
        // If JSON parsing fails, return the raw string (for tokens)
        return jsonValue;
      }
    } catch (e) {
      return null;
    }
  };

  const retrievedData = await retrieveData("user_token");

  let headders: any = {};

  if (!retrievedData || retrievedData === "") {
    headders = { "Content-Type": "application/json" };
  } else {
    headders = {
      "Content-Type": "application/json",
      datetime: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
      device_type: Platform.OS == "android" ? "android" : "ios",
      Authorization: "Bearer " + retrievedData,
    };
  }

  console.log("🔑 FETCH GET - headders:", headders);

  if (res) {
    try {
      const response = await fetch(`${payload?.url}`, {
        method: "GET",
        headers: headders,
      });
      if (response.status >= 200 && response.status <= 299) {
        const jsonResponse = await response.json();
        return Promise.resolve(jsonResponse);
      }
      const jsonResponse = await response.json();
      const error = jsonResponse.jsonResponse;
      if (jsonResponse?.message == "Unauthorized user!") {
        storeData("signin", "");
        storeData("profile", "");
      }
      return Promise.reject(jsonResponse?.message);
    } catch (error) {
      return Promise.reject("Something went wrong\n" + error);
    }
  } else {
    return Promise.reject("No Internet");
  }
};

export const fetchPost = async (payload) => {
  console.log("🔑 FETCH POST - payload:", payload?.url);
  console.log("🔑 FETCH POST - payload:", payload?.params);
  const res = await checkConnectivity();
  const authToken = await getAuthToken();

  const retrieveData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue == null) return null;

      // Try to parse as JSON first, if it fails, return as string
      try {
        return JSON.parse(jsonValue);
      } catch (parseError) {
        // If JSON parsing fails, return the raw string (for tokens)
        return jsonValue;
      }
    } catch (e) {
      return null;
    }
  };

  const retrievedData = await retrieveData("signin");

  const retrievedToken = await retrieveData("user_token");

  let headders: any = {};

  // Prioritize user_token over signin data
  const tokenToUse = retrievedToken || retrievedData?.token;

  if (
    !tokenToUse ||
    tokenToUse === "" ||
    tokenToUse === "null" ||
    tokenToUse === "undefined"
  ) {
    headders = { "Content-Type": "application/json" };
  } else {
    headders = {
      "Content-Type": "application/json",
      datetime: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
      device_type: Platform.OS == "android" ? "android" : "ios",
      Authorization: `Bearer ${tokenToUse}`,
    };
  }
  if (res) {
    try {
      const response = await fetch(`${payload?.url}`, {
        method: "POST",
        headers: headders,
        body: JSON.stringify(payload?.params),
      });
      if (response.status >= 200 && response.status <= 299) {
        const jsonResponse = await response.json();
        return Promise.resolve(jsonResponse);
      }
      const jsonResponse = await response.json();
      const error = jsonResponse.message;
      if (jsonResponse?.message == "Unauthorized user!") {
        storeData(asyncData.SIGNIN_DATA, "");
        storeData("signin", "");
        storeData("profile", "");
        // EventBus.getInstance().fireEvent("LogoutEvent", {
        // })
      }
      return Promise.reject(jsonResponse);
    } catch (error) {
      return Promise.reject("Something went wrong");
    }
  } else {
    return Promise.reject("No Internet");
  }
};
export const fetchDelete = async (payload) => {
  console.log("🔑 FETCH GET - payload:", payload?.url);

  const res = await checkConnectivity();

  const retrieveData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue == null) return null;

      // Try to parse as JSON first, if it fails, return as string
      try {
        return JSON.parse(jsonValue);
      } catch (parseError) {
        // If JSON parsing fails, return the raw string (for tokens)
        return jsonValue;
      }
    } catch (e) {
      return null;
    }
  };

  const retrievedToken = await retrieveData("user_token");
  const retrievedData = await retrieveData("signin");

  // Prioritize user_token over signin data (same logic as fetchPost)
  const tokenToUse = retrievedToken || retrievedData?.token;

  console.log("🔑 FETCH DELETE - retrievedToken:", retrievedToken);
  console.log("🔑 FETCH DELETE - retrievedData:", retrievedData);
  console.log("🔑 FETCH DELETE - tokenToUse:", tokenToUse);

  let headers: any = {};

  if (
    !tokenToUse ||
    tokenToUse === "" ||
    tokenToUse === "null" ||
    tokenToUse === "undefined"
  ) {
    console.log("❌ FETCH DELETE - No valid token found, using basic headers");
    headers = { "Content-Type": "application/json" };
  } else {
    console.log(
      "✅ FETCH DELETE - Valid token found, adding Authorization header"
    );
    headers = {
      "Content-Type": "application/json",
      datetime: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
      device_type: Platform.OS === "android" ? "android" : "ios",
      Authorization: `Bearer ${tokenToUse}`,
    };
  }

  if (res) {
    try {
      console.log("🌐 FETCH DELETE - URL:", payload?.url);
      console.log("🌐 FETCH DELETE - Headers:", headers);
      console.log("🌐 FETCH DELETE - Body:", JSON.stringify(payload?.params));

      const response = await fetch(`${payload?.url}`, {
        method: "DELETE",
        headers: headers,
        body: JSON.stringify(payload?.params),
      });

      const jsonResponse = await response.json();

      if (response.status >= 200 && response.status <= 299) {
        return Promise.resolve(jsonResponse);
      }

      if (jsonResponse?.message === "Unauthorized user!") {
        await storeData("signin", "");
        await storeData("profile", "");
      }

      return Promise.reject(jsonResponse?.message || "Delete failed");
    } catch (error) {
      return Promise.reject("Something went wrong");
    }
  } else {
    return Promise.reject("No Internet");
  }
};
export const fetchPaymentProfilePost = async (payload) => {
  console.log("🔑 FETCH GET - payload:", payload?.url);

  const isConnected = await checkConnectivity();

  if (!isConnected) {
    return Promise.reject("No Internet");
  }

  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(payload.url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload.payload),
    });

    // Removing BOM character from response
    const responseBody = await response.text();
    const jsonResponse = JSON.parse(responseBody.replace(/^\ufeff/, ""));

    if (response.ok) {
      return Promise.resolve(jsonResponse);
    } else {
      if (jsonResponse?.messages?.message === "Unauthorized user!") {
        storeData(asyncData.SIGNIN_DATA, "");
        storeData(asyncData.PROFILE_DATA, "");
        // EventBus.getInstance().fireEvent("LogoutEvent", {
        // })
      }

      return Promise.reject(jsonResponse?.messages?.message || "Unknown error");
    }
  } catch (error) {
    return Promise.reject("Something went wrong");
  }
};
export const fetchPut = async (payload) => {
  console.log("🔑 FETCH PUT - payload:", payload?.url);
  const res = await checkConnectivity();
  const authToken = await getAuthToken();

  const retrieveData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue == null) return null;

      // Try to parse as JSON first, if it fails, return as string
      try {
        return JSON.parse(jsonValue);
      } catch (parseError) {
        // If JSON parsing fails, return the raw string (for tokens)
        return jsonValue;
      }
    } catch (e) {
      return null;
    }
  };

  const retrievedData = await retrieveData("signin");
  const retrievedToken = await retrieveData("user_token");

  let headders: any = {};

  // Prioritize user_token over signin data
  const tokenToUse = retrievedToken || retrievedData?.token;

  if (
    !tokenToUse ||
    tokenToUse === "" ||
    tokenToUse === "null" ||
    tokenToUse === "undefined"
  ) {
    headders = { "Content-Type": "application/json" };
  } else {
    headders = {
      "Content-Type": "application/json",
      datetime: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
      device_type: Platform.OS == "android" ? "android" : "ios",
      Authorization: `Bearer ${tokenToUse}`,
    };
  }
  if (res) {
    try {
      const response = await fetch(`${payload?.url}`, {
        method: "PUT", // Only changed this line from POST to PUT
        headers: headders,
        body: JSON.stringify(payload?.params),
      });
      if (response.status >= 200 && response.status <= 299) {
        const jsonResponse = await response.json();
        return Promise.resolve(jsonResponse);
      }
      const jsonResponse = await response.json();
      const error = jsonResponse.message;
      if (jsonResponse?.message == "Unauthorized user!") {
        storeData(asyncData.SIGNIN_DATA, "");
        storeData("signin", "");
        storeData("profile", "");
        // EventBus.getInstance().fireEvent("LogoutEvent", {
        // })
      }
      return Promise.reject(jsonResponse);
    } catch (error) {
      return Promise.reject("Something went wrong");
    }
  } else {
    return Promise.reject("No Internet");
  }
};