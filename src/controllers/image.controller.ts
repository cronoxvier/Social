import path from 'path';
import { config } from '../config/config'
import multer from 'multer'
import { Endpoint, S3 } from 'aws-sdk';
import multerS3 from 'multer-s3'


const spacesEndPoint = new Endpoint(config.S3Endpoint)
const awsS3 = new S3({
    endpoint: spacesEndPoint,
    secretAccessKey: config.AwsAccessKeySecret,
    accessKeyId: config.AwsAccessKey
})

const uploadImg = multer({
    storage: multerS3({
        s3: awsS3,
        bucket: config.bucketName,
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, {
                fieldname: file.fieldname,

            })

        },
        key: (req, file, cb) => {
            cb(null, Date.now() + file.originalname)
        }
    }),
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    }
    //,
    // limits: { fileSize: 2097152 }
}).single('image')


const checkFileType = (file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp|jfif/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (extname && mimetype) {
        cb(null, true)
    } else {
        cb('Error: Image only!')
    }
}

const deletFile = (fieldname: string) => {
    const Fieldname = fieldname.split('.com/')
    const params = {
        Bucket: config.bucketName,
        Key:Fieldname[1]
    }
     awsS3.deleteObject(params).promise()
}


export { uploadImg,deletFile }

