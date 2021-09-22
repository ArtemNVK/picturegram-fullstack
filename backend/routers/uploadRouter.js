const multer = require('multer');
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const express = require('express');
const { isAuth } = require('../utils');
const path = require( 'path' );

const uploadRouter = express.Router();

const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  Bucket: 'picturegram-bucket'
 });

const image = multer({
	storage: multerS3({
		s3: s3,
		bucket: 'picturegram-bucket',
		acl: 'public-read',
		key: function (req, file, cb) {
			cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
		}
	}),
	limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
	fileFilter: function( req, file, cb ){
		checkFileType( file, cb );
	}
}).single('image');

/**
 * Check File Type
 * @param file
 * @param cb
 * @return {*}
 */
 function checkFileType( file, cb ){
	// Allowed ext
	const filetypes = /jpeg|jpg|png/;
	// Check ext
	const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
	// Check mime
	const mimetype = filetypes.test( file.mimetype );
	if( mimetype && extname ){
		return cb( null, true );
	} else {
		cb( 'Error: Images Only!' );
	}
}

/**
 * @route POST /api/profile/business-img-upload
 * @desc Upload post image
 * @access public
 */
 uploadRouter.post( '/', isAuth, ( req, res ) => {
	console.log('Upload router BELOW');
	console.log(req.body);
	image( req, res, ( error ) => {
		console.log( 'requestOkokok', req.file );
		console.log( 'error', error );
		if( error ){
			console.log( 'errors', error );
			res.json( { error: error } );
		} else {
			// If File not found
			if( req.file === undefined ){
				console.log( 'Error: No File Selected!' );
				res.json( 'Error: No File Selected' );
			} else {
				// If Success
				const imageName = req.file.key;
				const imageLocation = req.file.location;
// Save the file name into database into profile model
        res.json( {
          image: imageName,
          location: imageLocation
        } );
			}
		}
	});
});

module.exports = uploadRouter;

