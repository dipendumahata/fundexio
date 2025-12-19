require('dotenv').config({ path: './.env' });
const connectDB = require("./src/config/db");
const { app } = require("./src/app");

const PORT = process.env.PORT || 8000;

// 1. Database connection call (Waiting er dorkar nei Vercel er jonno, Mongoose handle kore nebe)
connectDB();

// 2. Sudhu matro Local Environment holei Server listen korbe
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`\n⚙️  Server is running at port: ${PORT}`);
    });
}

// 3. Vercel er jonno app export kora essential
module.exports = app;