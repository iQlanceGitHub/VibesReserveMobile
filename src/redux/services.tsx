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
      console.log("Error retrieving data:", e);
      return null;
    }
  };

  const retrievedData = await retrieveData("user_token");
  console.log("retrievedData----->", retrievedData);

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
  console.log("fetchGet...", payload?.url, headders);

  if (res) {
    try {
      const response = await fetch(`${payload?.url}`, {
        method: "GET",
        headers: headders,
      });
      if (response.status >= 200 && response.status <= 299) {
        const jsonResponse = await response.json();
        console.log("jsonResponse........success\n", jsonResponse);
        return Promise.resolve(jsonResponse);
      }
      const jsonResponse = await response.json();
      console.log("jsonResponse........error\n", jsonResponse);
      const error = jsonResponse.jsonResponse;
      if (jsonResponse?.message == "Unauthorized user!") {
        console.log("Hello");
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
  console.log("fetchPost...", payload);
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
      console.log("Error retrieving data:", e);
      return null;
    }
  };

  const retrievedData = await retrieveData("signin");

  const retrievedToken = await retrieveData("user_token");

  console.log("=== FETCHPOST TOKEN DEBUG ===");
  console.log("retrievedData (signin):", retrievedData);
  console.log("retrievedToken (user_token):", retrievedToken);
  console.log("retrievedToken type:", typeof retrievedToken);
  console.log("retrievedToken length:", retrievedToken?.length);

  let headders: any = {};

  // Prioritize user_token over signin data
  const tokenToUse = retrievedToken || retrievedData?.token;

  console.log("tokenToUse:", tokenToUse);
  console.log("tokenToUse type:", typeof tokenToUse);
  console.log("tokenToUse length:", tokenToUse?.length);

  if (!tokenToUse || tokenToUse === "" || tokenToUse === "null" || tokenToUse === "undefined") {
    console.log("No valid token available - using headers without auth");
    headders = { "Content-Type": "application/json" };
  } else {
    console.log("Using token for authorization");
    headders = {
      "Content-Type": "application/json",
      datetime: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
      device_type: Platform.OS == "android" ? "android" : "ios",
      Authorization: `Bearer ${tokenToUse}`,
    };
  }
  console.log("Final headers:", headders);
  console.log("=============================");
  if (res) {
    try {
      console.log("passed headders", headders);
      const response = await fetch(`${payload?.url}`, {
        method: "POST",
        headers: headders,
        body: JSON.stringify(payload?.params),
      });
      if (response.status >= 200 && response.status <= 299) {
        const jsonResponse = await response.json();
        console.log("jsonResponse........success\n", jsonResponse);
        return Promise.resolve(jsonResponse);
      }
      const jsonResponse = await response.json();
      console.log("jsonResponse........error\n", jsonResponse);
      const error = jsonResponse.message;
      if (jsonResponse?.message == "Unauthorized user!") {
        console.log("Hello");
        storeData(asyncData.SIGNIN_DATA, "");
        storeData("signin", "");
        storeData("profile", "");
        // EventBus.getInstance().fireEvent("LogoutEvent", {
        // })
      }
      return Promise.reject(jsonResponse);
    } catch (error) {
      console.log("==================================== ERROR");
      console.log(error);
      console.log("==================================== ERROR");
      return Promise.reject("Something went wrong");
    }
  } else {
    return Promise.reject("No Internet");
  }
};
export const fetchDelete = async (payload) => {
  const res = await checkConnectivity();

  const retrieveData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log("Error retrieving data:", e);
      return null;
    }
  };

  const retrievedToken = await retrieveData("user_token");
  console.log("retrievedToken----->", retrievedToken);

  let headers: any = {};

  if (!retrievedToken || retrievedToken === "") {
    headers = { "Content-Type": "application/json" };
  } else {
    headers = {
      "Content-Type": "application/json",
      datetime: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
      device_type: Platform.OS === "android" ? "android" : "ios",
      Authorization: `Bearer ${retrievedToken}`,
    };
  }

  console.log("fetchDelete...", payload?.url, headers);

  if (res) {
    try {
      const response = await fetch(`${payload?.url}`, {
        method: "DELETE",
        headers: headers,
      });

      const jsonResponse = await response.json();

      if (response.status >= 200 && response.status <= 299) {
        console.log("jsonResponse........success\n", jsonResponse);
        return Promise.resolve(jsonResponse);
      }

      console.log("jsonResponse........error\n", jsonResponse);

      if (jsonResponse?.message === "Unauthorized user!") {
        console.log("Unauthorized - clearing data");
        await storeData("signin", "");
        await storeData("profile", "");
      }

      return Promise.reject(jsonResponse?.message || "Delete failed");
    } catch (error) {
      console.log("DELETE request error:", error);
      return Promise.reject("Something went wrong");
    }
  } else {
    return Promise.reject("No Internet");
  }
};
export const fetchPaymentProfilePost = async (payload) => {
  console.log("fetchPost...", payload);
  const isConnected = await checkConnectivity();

  if (!isConnected) {
    return Promise.reject("No Internet");
  }

  const headers = {
    "Content-Type": "application/json",
  };

  try {
    console.log("payload:->>>:pay====", payload);

    const response = await fetch(payload.url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload.payload),
    });

    console.log("Response:pay", response);

    // Removing BOM character from response
    const responseBody = await response.text();
    const jsonResponse = JSON.parse(responseBody.replace(/^\ufeff/, ""));

    console.log("Response JSON:", jsonResponse);

    if (response.ok) {
      console.log("jsonResponse success:", jsonResponse);
      return Promise.resolve(jsonResponse);
    } else {
      console.log("jsonResponse error:", jsonResponse);

      if (jsonResponse?.messages?.message === "Unauthorized user!") {
        console.log("Unauthorized user!");
        storeData(asyncData.SIGNIN_DATA, "");
        storeData(asyncData.PROFILE_DATA, "");
        // EventBus.getInstance().fireEvent("LogoutEvent", {
        // })
      }

      return Promise.reject(jsonResponse?.messages?.message || "Unknown error");
    }
  } catch (error) {
    console.log("Error:", error);
    return Promise.reject("Something went wrong");
  }
};
export const fetchPut = async (payload) => {
  console.log("fetchPut...", payload);
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
      console.log("Error retrieving data:", e);
      return null;
    }
  };

  const retrievedToken = await retrieveData("user_token");
  console.log("retrievedToken----->", retrievedToken);

  let headers: any = {};

  if (!retrievedToken || retrievedToken === "") {
    headers = { "Content-Type": "application/json" };
  } else {
    headers = {
      "Content-Type": "application/json",
      datetime: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
      device_type: Platform.OS == "android" ? "android" : "ios",
      Authorization: `Bearer ${retrievedToken}`,
    };
  }

  console.log("passed headers", headers);

  if (res) {
    try {
      const response = await fetch(`${payload?.url}`, {
        method: "PUT", // Changed to PUT
        headers: headers,
        body: JSON.stringify(payload?.params),
      });

      if (response.status >= 200 && response.status <= 299) {
        const jsonResponse = await response.json();
        console.log("jsonResponse........success\n", jsonResponse);
        return Promise.resolve(jsonResponse);
      }

      const jsonResponse = await response.json();
      console.log("jsonResponse........error\n", jsonResponse);

      if (jsonResponse?.message == "Unauthorized user!") {
        console.log("Unauthorized - clearing data");
        await storeData("signin", "");
        await storeData("profile", "");
      }

      return Promise.reject(jsonResponse?.message || "Update failed");
    } catch (error) {
      console.log("PUT request error:", error);
      return Promise.reject("Something went wrong");
    }
  } else {
    return Promise.reject("No Internet");
  }
};
