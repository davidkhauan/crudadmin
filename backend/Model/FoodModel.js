const mongoose = require ('../DB/connection')
const { Schema } = mongoose

const Food = mongoose.model (
    'Food',
    new Schema ({
        name: { type: String, required: true },
        sauce: { type: String, required: true },
        salad: { type: String, required: true },
        hamburger: { type: String, required: true },
        images: { type: Array, required: true },
        available: { type: Boolean, required: true },
        user: Object
    }, { timestamps: true })
)

module.exports = Food