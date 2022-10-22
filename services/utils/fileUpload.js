const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadCsvPath = "./public/uploads/csv/";

const mb = 1024 * 1024;

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadCsvPath); // upload path required
    },
    filename: (req, file, callback) => {
        const extension = path.extname(file.originalname); // will get .csv
        const fileName = `csv-${Date.now()}${extension}`;
        callback(null, fileName);
    },
});

const isCSV = (req, file, callback) => {
    if (file.mimetype.endsWith("csv")) {
        callback(null, true);
    } else {
        callback(new Error("Only .csv format is allowed!"));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: isCSV,
    limits: {
        fileSize: mb * 2,
    },
});

const uploadCSVfile = upload.single("csvFile");

module.exports = {uploadCSVfile};
