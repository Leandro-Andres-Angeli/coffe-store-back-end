const { Router } = require('express');
const router = Router();
const cloudinary = require('../config/cloudinary');
router.patch('/', async function (req, res) {
  try {
    const { image } = req.body;
    /* Hard coded id  */
    /* 672ac1c5269e19ede8d4d940 */
    /* Hard coded id  */

    const uploadedImage = await cloudinary.uploader.upload(
      image,
      {
        resource_type: 'image',
        upload_preset: 'unsigned_upload',
        folder: 'avatar',
        allowed_formats: ['png', 'jpg', 'jpeg', 'svg', 'ico', 'jfif', 'webp'],
      },
      function (err, result) {
        if (err) {
          console.log(err);
        }
        console.log(result);
      }
    );
    console.log(uploadedImage);

    res.status(200).json({ ok: true, message: 'patch' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'server error' });
  }
});

module.exports = router;
