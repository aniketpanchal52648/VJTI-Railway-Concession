const cloudinary=require('cloudinary');
const {CludinaryStorage}=require('multer-storage-cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

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