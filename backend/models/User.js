const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const applyJsonTransform = require('./plugins/toJSONTransform');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  },
  verified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String
  },
  otpExpires: {
    type: Date
  },
  forgotPasswordOtp: {
    type: String
  },
  forgotPasswordOtpExpires: {
    type: Date
  },
  profile: {
    avatar: String,
    bio: String,
    phoneNumber: String,
    dateOfBirth: String,
    gender: String,
    address: String,
    preferredLanguage: {
      type: String,
      default: 'English'
    },
    interests: [String],
    darkMode: {
      type: Boolean,
      default: false
    },
    fontSize: {
      type: String,
      default: '16'
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    },
    appNotifications: {
      type: Boolean,
      default: true
    }
  },
  darkModePreference: {
    type: Boolean,
    default: false
  }
  ,
  instructorProfile: {
    bio: String,
    qualifications: String,
    phoneNumber: String,
    profilePicture: String,
    profilePicturePreview: String,
    linkedinUrl: String,
    portfolioUrl: String,
    githubUrl: String,
    twitterUrl: String,
    subjectExpertise: [String],
    availabilitySlots: String,
    twoFactorAuth: {
      type: Boolean,
      default: false
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    },
    appNotifications: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

applyJsonTransform(userSchema);

module.exports = mongoose.model('User', userSchema);