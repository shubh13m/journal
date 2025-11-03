import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

export const getJournals = async (token = null) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await API.get("journals/", { headers });
  return res.data;
};

export const createJournal = async (data, token) => {
  const res = await API.post("journals/", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
