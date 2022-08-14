const mongoose=require('mongoose');
const {Schema}  = mongoose;
const bcrypt=require('bcryptjs');//para cifrar las contraseñas

const UserSchema=new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    date:{type:Date,default:Date.now},
},
{
  timestamps: true,
  versionKey: false,
});

//de esta forma funcionaria, pero lo ideal es comenzar a cifrar las contraseñas de los usuarios

UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  };
  
  UserSchema.methods.matchPassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

module.exports=mongoose.model('User',UserSchema);