import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User Must have a name'],
  },
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide valid email address'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'user must have a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please conform the password'],
    validate: {
      validator(password: string) {
        return password === this.password;
      },
      message: 'Password do not match',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.methods.comparePasswords = function (
  candidatePasssword,
  userPassword,
) {
  return bcrypt.compare(candidatePasssword, userPassword);
};
userSchema.methods.changePasswordLast = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changeTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimeStamp < changeTime;
  }
  return false;
};
const User = mongoose.model('User', userSchema);
export default User;
