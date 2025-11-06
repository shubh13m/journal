import axios from "./axiosClient";

export const loginUser = async (username, password) => {
  const response = await axios.post("/token/", { username, password });
  const token = response.data.access;

  // Fetch user profile info (assuming you have /api/users/me/ endpoint)
  const userResponse = await axios.get("/users/me/", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return { token, user: userResponse.data };
};
