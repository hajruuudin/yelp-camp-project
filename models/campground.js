const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const options = {toJSON: {virtuals: true}}

const CampgroundSchema = new Schema({
    title: String,
    images: [String],
    geometry: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, options);

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `
    <a href="/campgrounds/${this.id}">${this.title}</a>
    <p>${this.description.substring(0, 30)}...</p>
    `
})



module.exports = mongoose.model('Campground', CampgroundSchema);