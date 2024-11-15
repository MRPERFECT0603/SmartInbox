const mongoose = require("mongoose");
const ContextSchema = mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    context: {
        type: String,
    },

},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Context", ContextSchema);