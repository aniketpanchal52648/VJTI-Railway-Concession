const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// require('dotenv').config();
// console.log(process.env.CLOUDINARY_CLOUD_NAME,process.env.CLOUDINARY_KEY);
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})
// cloudinary.config({
//     cloud_name: "aniket52648",
//     api_key: "643478963621266",
//     api_secret: "BBzEhLPXFzMHVKIaZOvNLi8kNsA"
// })

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'RailGhateMai',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});
module.exports = {
    cloudinary,
    storage
}