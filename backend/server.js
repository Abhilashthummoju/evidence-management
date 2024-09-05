//Local module imports
const { db_insert_case, add_admin, delete_admin,view_all_cases, delete_user, fetch_caseName,get_all_admins } = require('./database.js');
const { check_id } = require('./database.js');
const { find_evidences } = require('./database.js');
const { blockchainInsert, insertLog, chainOfCustody } = require('./blockchainConnect.js');
const { authToken, hashPasswd, validateUser, authUser } = require('./auth.js');
const { add_user } = require('./database.js');
const morgan = require('morgan');
const crypto = require('crypto');


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors'); 
const path = require('path');
const fs = require("fs");

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'images')));


const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  // allowedHeaders: ['Content-Type', 'Authorization'],
  // methods: ['GET', 'POST', 'OPTIONS'],

};

app.use(cors(corsOptions));

app.post('/api/login', upload.none(), async (req, res) => {
  const result = await validateUser(req.body);
  res.send({
    messageType: result === 'invalid' ? 'error' : 'success',
    messageContent: result === 'success' ? 'Login Successful' : 'Invalid Credentials',
    token: result === 'success' ? authToken(req.body.id) : null,
    user: req.body.userType
  });
});


// Function to compute the file hash
const computeFileHash = (filePath) => {
  return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);

      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', (err) => reject(err));
  });
};


app.post('/api/upload', authUser, upload.single('evidence'), async (req, res) => {
  let case_no = req.body.caseNo;
  let id = req.user;
  let case_name = req.body.caseName;

  console.log("FILE", req.file)
  let file_name = req.file.originalname;
  let file_type = req.file.mimetype;
  let file_path = path.join(__dirname, `./images/${file_name}`);
  console.log("FILEPATH",file_path)
  fs.access(file_path, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File does not exist:", file_path);
    } else {
      console.log("File uploaded successfully:", file_path);
    }
  });
  let is_id_valid = await check_id(id);

  console.log("HEY",case_no,id,case_name,file_name,file_type,file_path)
  if (is_id_valid) {
    console.log("hey2",is_id_valid)
    let result = await db_insert_case(case_no, case_name, file_name, file_type);
    console.log("hey3",result)
    if (result === true) {
      // Compute the hash of the file content
      let cid = '';
      await computeFileHash(file_path).then((hash) => {
          cid = hash;
      }).catch((err) => {
          console.error("Error computing file hash:", err);
          res.status(500).send({
              messageType: "error",
              messageContent: "Failed to compute file hash"
          });
          return;
      });
      await blockchainInsert(id, case_no, case_name, file_name, file_type,cid,"Upload");  // Insert into blockchain
      res.send({
        messageType: "success",
        messageContent: "File inserted"
      });
    } else {
      res.send({
        messageType: "error",
        messageContent: "Case number and Case name do not match"
      });
    }

    // setTimeout(() => {
    //   fs.unlink(file_path, (err) => {
    //     if (err) {
    //       console.error(err);
    //       return;
    //     }
    //     console.log('File deleted successfully');
    //   });
    // }, 1000);
  } else {
    res.send({
      messageType: "error",
      messageContent: "Invalid ID"
    });

    setTimeout(() => {
      fs.unlink(file_path, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('File deleted successfully');
      });
    }, 1000);
  }
});

app.post('/api/view', upload.none(), async (req, res) => {
  let caseNo = req.body.caseNo;

  let fileNames;
  let fileTypes;
  console.log("HELLO")
  await find_evidences(caseNo).then((res) => {
    console.log("hey",res,res[0])
    fileNames = res[0];
    fileTypes = res[1];
  });

  if (!fileNames) {
    console.log("nothing here")
    res.send(false);
  } else {
    const fileList = fileNames.map((fileName, index) => ({
      key: index + 1,
      fileName: fileName,
      fileType: fileTypes[index]
    }));

    console.log("FILE",fileList)
    res.send(fileList);
  }
});

app.post('/api/coc', authUser, upload.none(), async (req, res) => {
  const id = req.user;
  const caseNo = req.body.caseNo;
  const fileName = req.body.fileName;
  const fileType = req.body.fileType;
  const _status_ = "View";

  // Fetch the case name
  const caseName = await fetch_caseName(caseNo.toString());

  // Log the event in the chain of custody
  await insertLog(id, caseNo, caseName, fileName, fileType, _status_);

  // Construct the file path
  const filePath = path.join(__dirname, 'images', fileName);

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send({
        messageType: 'error',
        messageContent: 'File not found'
      });
    } else {
      // Send the file URL back to the frontend
      res.send({
        messageType: 'success',
        messageContent: 'File found',
        fileUrl: `http://localhost:5001/images/${fileName}`
      });
    }
  });
});


app.post('/api/admin/add', upload.none(), async (req, res) => {
  const passwd = hashPasswd(req.body.id);
  console.log("REQ BOYD", req.body)
  let result;
  if (req.body.userType === "admin") {
    result = await add_admin(req.body, passwd);
  } else {
    result = await add_user(req.body, passwd);
  }

  res.send({
    messageType: result,
    messageContent: result === 'success' ? 'User Created' : 'Error adding user'
  });
});

app.post('/api/admin/delete', upload.none(), async (req, res) => {
  let result;
  if (req.body.userType === "admin") {
    result = await delete_admin(req.body);
  } else {
    result = await delete_user(req.body);
  }

  res.send({
    messageType: result,
    messageContent: result === 'success' ? 'User Deleted' : 'Error deleting user'
  });
});

app.post('/api/admin/logs', upload.none(), async (req, res) => {
  const caseNo = req.body.caseNo;
  const result = await chainOfCustody(caseNo);

  res.send(result);
});

app.get('/api/admin/all', async (req, res) => {
  try {
      const admins = await get_all_admins();
      res.send({
          messageType: 'success',
          data: admins
      });
  } catch (error) {
      res.status(500).send({
          messageType: 'error',
          messageContent: error
      });
  }
});


app.get('/api/cases', async (req, res) => {
  try {
      const cases = await view_all_cases();
      res.send({
          messageType: "success",
          messageContent: "Cases retrieved successfully",
          data: cases
      });
  } catch (err) {
      res.send({
          messageType: "error",
          messageContent: "Failed to retrieve cases",
          error: err.message
      });
  }
});

app.listen(5001, () => {
  console.log('Server started on port 5000');
});
