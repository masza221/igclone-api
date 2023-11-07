import { upload } from "../store/index.js";
export const uploadFile = async (req, res) => {
  try {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).send(err.message);
      }

      if (!req.file) {
        return res.status(400).send('No image file uploaded');
      }

      const filePath = req.file.path.substring(7);
      const fileUrl = `${req.protocol}://${req.get('host')}/${filePath}`;

      res.json({ success: true, message: 'File saved', fileUrl });
    });
  } catch (error) {
    res.status(500).send('Error handling image upload');
  }
};
