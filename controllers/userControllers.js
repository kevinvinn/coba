const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const imagekit = require("../libs/imageKit");

class userControllers {
  static async addUser(req, res) {
    try {
      const { name, email } = req.body;

      const userAdd = await prisma.user.create({
        data: {
          name,
          email,
        },
      });

      res.status(201).json({
        message: "Sukses tambah user cuy",
        user: userAdd,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Gagal tambah user brok" });
    }
  }

  static async editUser(req, res) {
    try {
      const userId = parseInt(req.params.id, 10);
      const { name, email, imageId } = req.body;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
          email,
        },
      });

      res.status(200).json({
        message: "sukses update user brok",
        user: updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "gagal update user brok" });
    }
  }

  static async getUser(req, res) {
    try {
      const userId = parseInt(req.params.id, 10);

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: "User ga ada nih" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Gagal ambil data user" });
    }
  }

  static async deleteUser(req, res) {
    try {
      const userId = parseInt(req.params.id, 10);

      await prisma.user.delete({
        where: { id: userId },
      });

      res.status(200).json({
        message: "sukses hapus user brok",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "gagal hapus user nih" });
    }
  }

  static async addImage(req, res) {
    try {
      if (!req.file || req.file.length === 0) {
        return res
          .status(400)
          .json({ message: "Bad request", error: "gagal tambah image cuy" });
      }

      const stringFile = req.file.buffer.toString("base64");

      const uploadImage = await imagekit.upload({
        fileName: req.file.originalname,
        file: stringFile,
      });

      if (uploadImage) {
        const { userId } = req.body;

        const resultAdd = await prisma.image.create({
          data: {
            imageUrl: uploadImage.url,
            imageFieldId: uploadImage.fileId,
            user: {
              connect: {
                id: parseInt(userId, 10),
              },
            },
          },
        });

        res.status(201).json({
          message: "Sukses upload foto bang",
          image: uploadImage,
          resultAdd,
        });
      } else {
        res.status(500).json({ error: "Gagal mengupload gambar cuy" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Terjadi kesalahan saat upload foto" });
    }
  }

  static async updateImage(req, res) {
    try {
      const imageId = parseInt(req.params.id, 10);

      if (!req.file || req.length === 0) {
        return res
          .status(400)
          .json({ message: "Bad request", error: "gagal update image" });
      }

      const stringFile = req.file.buffer.toString("base64");

      const oldImage = await prisma.image.findUnique({
        where: { id: imageId },
      });
      if (!oldImage) {
        return res.status(404).json({ error: "file foto ga ada" });
      }

      await imagekit.deleteFile(oldImage.imageFieldId);

      const uploadImage = await imagekit.upload({
        fileName: req.file.originalname,
        file: stringFile,
      });

      if (uploadImage) {
        const updatedImage = await prisma.image.update({
          where: { id: imageId },
          data: {
            imageUrl: uploadImage.url,
            imageFieldId: uploadImage.fileId,
          },
        });

        res.json({
          message: "Sukses update foto brok",
          image: uploadImage,
          updatedImage,
        });
      } else {
        res.status(500).json({ error: "Waduh gagal mih" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Waduh gagal lagi nih" });
    }
  }
  static async getImage(req, res) {
    try {
      const imageId = parseInt(req.params.id, 10);

      const image = await prisma.image.findUnique({
        where: { id: imageId },
      });

      if (!image) {
        return res.status(404).json({ error: "foto kaga ada" });
      }

      res.status(200).json({
        message: "Sukses dapet foto",
        image,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Gagal dapetin foto" });
    }
  }

  static async deleteImage(req, res) {
    try {
      const imageId = parseInt(req.params.id, 10);

      const image = await prisma.image.findUnique({ where: { id: imageId } });
      if (!image) {
        return res.status(404).json({ error: "foto kaga ada" });
      }
      console.log("Attempting to delete image with ID:", image.imageFieldId);

      await imagekit.deleteFile(image.imageFieldId);

      await prisma.image.delete({
        where: { id: imageId },
      });

      res.json({
        message: "Sukses hapus foto nih",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Gagal hapus foto bang" });
    }
  }
  static async handleMoreImage(req, res) {
    try {
      if (req.files.length === 0) {
        return res.status(400).json({
          message: "BAD REQUEST",
          error: "Tambah minimal 1 foto lah",
        });
      }

      const imageUrls = [];
      const imageFieldIds = [];

      for (const file of req.files) {
        const stringFile = file.buffer.toString("base64");
        const uploadImage = await imagekit.upload({
          fileName: file.originalname,
          file: stringFile,
        });

        if (uploadImage) {
          imageUrls.push(uploadImage.url);
          imageFieldIds.push(uploadImage.fileId);
        } else {
          return res.status(500).json({ error: "Gagal upload foto" });
        }
      }

      const resultAddImages = await prisma.image.createMany({
        data: req.files.map((file, index) => ({
          imageUrl: imageUrls[index],
          imageFieldId: imageFieldIds[index],
          userId: parseInt(req.body.userId, 10),
        })),
      });

      res.status(200).json({
        message: "Sukses upload multiple foto cuy",
        resultAddImages,
        imageUrls,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Terjadi kesalahan saat upload foto" });
    }
  }
}

module.exports = userControllers;
