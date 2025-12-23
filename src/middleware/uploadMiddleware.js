const multer = require('multer')
const path = require('path')

// where to save files
const storage = multer.diskStorage({
    destination:(req , file ,cb)=>{
        cb(null , "uploads/")
    },
    filename: (req, file ,cb)=>{
        cb(null , Date.now() + path.extname(file.originalname));
    }
})

// check images
const fileFilter = (req , file , cb)=>{
    if(file.mimetype.startsWith('image/')){
        cb(null,true);
    }else{
        cb(new Error("Images only can upload") , false);
    }
}

const upload = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{fieldSize: 5  *1024 * 1024 } //size 5mb
})

module.exports = upload;


