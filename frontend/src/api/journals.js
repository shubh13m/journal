// src/api/journals.js
import axiosClient from "./axiosClient";

export const getJournals = async () => {
  try {
    const response = await axiosClient.get("journals/");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching journals:", error);
    return [];
  }
};

export const createJournal = async (formData) => {
  try {
    const response = await axiosClient.post("journals/", formData);
    return response.data;
  } catch (error) {
    console.error("Error creating journal:", error);
    throw error;
  }
};
