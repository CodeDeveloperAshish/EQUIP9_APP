import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Ngrock https Link
const BaseUrl = "https://e129-152-59-7-81.ngrok-free.app/api";

const signIn = async (mobileNumber, password) => {
  try {
    const response = await axios.post(`${BaseUrl}/login`, {
      mobileNumber,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const register = async (firstName, lastName, mobileNumber, password) => {
  try {
    const response = await axios.post(`${BaseUrl}/register`, {
      firstName,
      lastName,
      mobileNumber,
      password,
    });
    return response.data;
  } catch (error) {
    // Handle the error here

    throw error; // Rethrow theb error to propagate it to the caller
  }
};

const getProfile = async (id) => {
  try {
    const response = await axios.get(`${BaseUrl}/getProfile/${id}`);
    return response.data[0];
  } catch (error) {
    // Handle the error here

    throw error; // Rethrow theb error to propagate it to the caller
  }
};

const updateProfile = async (id, firstName, lastName, mobileNumber) => {
  const accessToken = await SecureStore.getItemAsync("accessToken");
  try {
    const response = await axios.put(
      `${BaseUrl}/update_profile`,
      {
        id,
        firstName,
        lastName,
        mobileNumber,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    // Handle the error here
    throw error; // Rethrow theb error to propagate it to the caller
  }
};

const deleteUser = async (id) => {
  const accessToken = await SecureStore.getItemAsync("accessToken");

  try {
    const response = await axios.delete(
      `${BaseUrl}/delete_user/${id}`,

      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    // Handle the error here

    throw error; // Rethrow theb error to propagate it to the caller
  }
};

export default {
  signIn,
  register,
  getProfile,
  updateProfile,
  deleteUser,
};
