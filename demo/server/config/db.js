const mongoose = require('mongoose');
const dbUrl = 'mongodb://localhost:27017/onesapp'


exports.connect = () => {
    mongoose.connect(dbUrl, (err) => {
        if(err){
            console.log('connect failed');
        }else{
            console.log('connect success');
        }
    })
}