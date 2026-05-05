import multer from "multer";
import path from "path";

// penyimpanan sementara di memori ram
const storage = multer.memoryStorage();

const fileFilter = (req, file, next) => {
    const ext = path.extname(file.originalname).toLowerCase();

    // contoh filter file (hanya menerima gambar)
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
        return next(new Error("Hanya file gambar yang diperbolehkan (jpg, jpeg, png)"), false);
    }

    next(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

export default upload;
