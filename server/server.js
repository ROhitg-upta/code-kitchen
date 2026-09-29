import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🔥 [ChefOps v2.6 Backend] Express + HMAC-SHA256 API live at http://localhost:${PORT}/api/health`
  );
});
