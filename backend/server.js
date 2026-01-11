const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/auth"));
app.use("/reports", require("./routes/reports"));
app.use("/vitals", require("./routes/vitals"));
app.use("/share", require("./routes/share"));   // IMPORTANT

app.listen(5000, () => console.log("Backend running on 5000"));
