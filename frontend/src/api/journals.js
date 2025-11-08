import axiosClient from "./axiosClient";

// Existing calls
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

// New: Fetch journals by author username with visibility filtering
export const getJournalsByAuthor = async (username) => {
  try {
    const response = await axiosClient.get(`journals/author/${username}/`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(`Error fetching journals for author ${username}:`, error);
    return [];
  }
};
