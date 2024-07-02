const express = require("express");
const PORT = 3001;
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extends: true }));

app.use("/api/analyzer", require("./Routes/Analyzer"));

app.listen(PORT, (req, res) => {
    console.log(`server is running on port ${PORT}`);
})