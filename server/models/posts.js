var mongoose = require("mongoose");

/**
 * replies are handled by using the _id, query both (post, and reply model), 
 * and give both back... might not be the best in terms of efficiency but i dont wish to have a massive schema
 */

var postSchema = mongoose.Schema({ // post id = _id
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users'
    },
    content: {
        type: String,
        required: false // Not required, images exist, hopefully.
    },
    image: {
        type: String
    },
    views: {
        type: Number,
        default: 0 // if queried we can increment this, not accurate but its there
    }
}, { timestamps: true }) // createdAt, updateAt

var posts = mongoose.model('posts', postSchema)

module.exports = posts;