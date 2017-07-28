var express = require('express');
var sizeOf = require('image-size');
var multer = require('multer');
var path = require('path');
var crypto = require('crypto');
var router = express.Router();
var fs = require('fs');
var easyimg = require('easyimage');
var im = require('imagemagick');
var gm = require("gm");

function get_base_name(pathName) {
    return pathName.substr(0, pathName.lastIndexOf('.'));
}

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../public/images')
    },
    filename: function(req, file, cb) {
        crypto.pseudoRandomBytes(16, function(err, raw) {
            var ext = path.extname(file.originalname);
            var fileName = get_base_name(file.originalname);
            savedFileName = fileName + "." + raw.toString('hex') + ext
            if (ext == ".jpg" || ext == ".png") {
                cb(null, savedFileName);
            } else {
                return false;
            }
        });
    }
});

var upload = multer({
    storage: storage
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Insider Task'
    });
});

router.post('/', upload.any(), function(req, res, next) {
    res.json(req.files[0].filename);
});

router.post("/changeImages", function(req, res, next) {
    // url = req.body.path;
    url = path.parse(req.body.url).base;
    x = req.body.x;
    y = req.body.y;
    ext = path.extname(url);
    basename = get_base_name(url);
    root_src = "../public/images/";
    fullPath = root_src + url;
    if (!fs.existsSync(root_src + basename)){
        fs.mkdirSync(root_src + basename);
    }
    root_src += basename + "/"
    img_755_450 = root_src + basename + "_755_450" + ext
    img_365_450 = root_src + basename + "_365_450" + ext
    img_365_212 = root_src + basename + "_365_212" + ext
    img_380_380 = root_src + basename + "_380_380" + ext
    gm(fullPath)
        .crop('755', '450', x,y)
        .write(img_755_450, function(err) {
            if (!err) console.log(' hooray! ');
            else console.log(err);
        });
    gm(fullPath)
        .crop('365', '450', x,y)
        .write(img_365_450, function(err) {
            if (!err) console.log(' hooray! ');
            else console.log(err);
        });
    gm(fullPath)
        .crop('365', '212', x,y)
        .write(img_365_212, function(err) {
            if (!err) console.log(' hooray! ');
            else console.log(err);
        });
    gm(fullPath)
        .crop('380', '380', x,y)
        .write(img_380_380, function(err) {
            if (!err) console.log(' hooray! ');
            else console.log(err);
        });
    res.json({"base": basename, "ext": ext});
});

module.exports = router;
