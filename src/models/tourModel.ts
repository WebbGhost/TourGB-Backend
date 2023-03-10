import mongoose from 'mongoose';
// import slugify from 'slugify';

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour Must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'Name should not be axceed 40 characters'],
      minLength: [5, 'Name Should be at least 5 characters'],
    },
    duration: {
      type: Number,
      required: [true, 'Tour Must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour Must have a maximum group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'Tour Must have a difficulty'],
      enum: {
        values: ['easy', 'hard', 'difficult'],
        message: 'Difficulty must be either easy or hard or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 0,
    },
    ratingsQuantity: {
      type: Number,
      default: 4.5,
      min: [1, 'Minimum rating must 1 or greater '],
      max: [5, 'max rating must below 5'],
    },
    price: {
      type: Number,
      required: [true, 'Tour Must have a price'],
    },
    // priceDiscount: {
    //     type: Number,
    //     validate: {
    //         function(val) {
    //             return val < this.price;
    //         },
    //         message: 'Price discount must be greater than price',
    //     },
    // },
    summary: {
      type: String,
      required: [true, 'Tour Must have a summary'],
      trim: true,
    },
    description: {
      type: String,

      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'Tour Must have an image cover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    startDates: [Date],
    slug: String,
    secret: {
      type: Boolean,
      default: false,
    },
  },

  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);
// toursSchema.virtual('durationWeek').get(function () {
//   return this.duration / 7;
// });

// // Document Middle wares it runs before on save and create only
// toursSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });
// // toursSchema.pre('save', function (next) {
// //     console.log(this);
// //     next();
// // });
// // toursSchema.post('save', (doc, next) => {
// //     console.log(doc);
// //     next();
// // });
// toursSchema.pre(/^find/, function (next) {
//   this.find({
//     secret: { $ne: false },
//   });
//   this.start = Date.now();

//   next();
// });
// toursSchema.post(/^find/, function (docs, next) {
//   console.log(`The Time is ${Date.now() - this.start} Milliseconds`);

//   next();
// });

// // Aggregaion middle ware =====
// toursSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({
//     $match: {
//       secret: {
//         $ne: true,
//       },
//     },
//   });
//   next();
// });
const Tour = mongoose.model('Tour', toursSchema);
export default Tour;
