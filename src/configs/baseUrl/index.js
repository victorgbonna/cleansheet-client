const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://football-cleansheet-data-api.onrender.com"
      // : "http://localhost:5002";
    // :"http://192.168.153.36:5002";
    // : "http://localhost:5002";
    : "http://127.0.0.1:8000";
    // :"https://football-cleansheet-data-api.onrender.com"

export default baseURL 