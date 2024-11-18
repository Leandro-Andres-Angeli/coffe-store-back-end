const { Router } = require('express');
const router = Router();
const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinary');
const { connectToCollection } = require('../database/config');
const { ObjectId } = require('mongodb');
const validateThereIsToken = require('../validations/validateThereIsToken');
const { authenticateUser } = require('../controllers/auth');
router.patch(
  '/public',
  validateThereIsToken,
  authenticateUser,
  async function (req, res) {
    try {
      const { image, name, lastName } = req.body;

      let profilePicture = Boolean(image) ? image : '';
      if (image && image.length > 500) {
        await cloudinary.uploader.upload(
          image,
          {
            resource_type: 'image',
            upload_preset: 'unsigned_upload',
            folder: 'avatar',
            allowed_formats: [
              'png',
              'jpg',
              'jpeg',
              'svg',
              'ico',
              'jfif',
              'webp',
            ],
            transformation: { width: 200, height: 200, crop: 'scale' },
          },
          function (err, result) {
            if (err) {
              throw Error('error updating picture');
            }
            profilePicture = result.secure_url;
          }
        );
      }

      const users = await connectToCollection('users');
      await users.findOneAndUpdate(
        { _id: new ObjectId(req.user.id) },
        { $set: { name, lastName, avatar: profilePicture } }
      );

      return res
        .status(200)
        .json({ ok: true, message: 'profile data updated' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ ok: false, message: 'server error' });
    }
  }
);
router.patch(
  '/security',
  validateThereIsToken,
  authenticateUser,
  async function (req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      const users = await connectToCollection('users');

      const user = await users.findOne({ _id: new ObjectId(req.user.id) });
      const { password } = user;
      const comparePasswordHashed = bcrypt.compareSync(
        currentPassword,
        password
      );

      if (!comparePasswordHashed) {
        return res.status(403).json({
          ok: false,
          message: 'must provide correct current password in order to update',
        });
      }
      const salt = bcrypt.genSaltSync();
      const hashedPassword = bcrypt.hashSync(newPassword, salt);
      await users.findOneAndUpdate(
        { _id: new ObjectId(req.user.id) },
        { $set: { password: hashedPassword } }
      );
      return res
        .status(200)
        .json({ ok: true, message: 'profile data updated' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ ok: false, message: 'server error' });
    }
  }
);

module.exports = router;
