import mongoose from 'mongoose';
import { Hashword } from '../services/hashword';

// since mongodb by default would not recognize type checking needed for,
// it is needed to be define

interface UserAttrs {
  email:string;
  password:string;
}

interface UserDoc extends mongoose.Document {
  email:string;
  password:string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs:UserAttrs):UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      }
    }
  }
);

// hashed password string before saving
userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    let hashed = await Hashword.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

// adding `build` method
userSchema.statics.build = (attrs:UserAttrs) => new userSchema(attrs);

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
