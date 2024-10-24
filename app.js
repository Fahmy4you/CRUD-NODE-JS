const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require('express-session');
const cookie = require('cookie-parser');
const flash = require('connect-flash');
const models = require("./models/MahasiswaModel");
const { body, validationResult, check } = require('express-validator')

const app = express();
const port = 3000;
const log = console.log;

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended : true }));
app.use(cookie('secret'));
app.use(session({
    cookie : { maxAge : 6000 },
    secret : 'secret',
    resave : true,
    saveUninitialized : true,
  })
);
app.use(flash());


app.get('/', (req, res) => {
  res.render('index', {
    title: "Index Page",
    layout: 'layout/main-layout',
  });
  
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: "About Page",
    layout: 'layout/main-layout',
  });
  
});

app.get('/mahasiswa', async (req, res) => {
  const mahasiswa = await models.getMahasiswa();
  res.render('mahasiswa', {
    title: "Mahasiswa Page",
    layout: 'layout/main-layout',
    mahasiswa: mahasiswa,
    msg: req.flash('msg'),
  });
  
});

app.get('/mahasiswa/add', async (req, res) => {
  res.render('mahasiswa-add', {
    title: "Create Data Mahasiswa Page",
    layout: 'layout/main-layout',
  });
  
});

app.post('/mahasiswa', [
    body('nama').custom(value => {
      if(value == "") {
        throw new Error("Field Nama Harus Diisi!");
      }
      return true;
    }),
    
    body('email').custom(value => {
      if(value == "") {
        throw new Error("Field Email Harus Diisi!");
      }
      return true;
    }),
    
    check('email', 'Field Email Tidak Valid').isEmail(),
    
    check('nama', 'Field Nama Minimal Harus 3 Karakter').isLength({ min:3 }),
    
  ], (req, res) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
      res.render('mahasiswa-add', {
        layout : "layout/main-layout",
        title : "Create Data Mahasiswa Page",
        errors: errors.array(),
      });
    } else {
      models.CreateDataMahasiswa(req.body);
      req.flash('msg', 'Data Contact Berhasil Di Tambahkan');
      res.redirect('/mahasiswa');
    }
  
})

app.get('/mahasiswa/delete/:id', async (req, res) => {
  const cekData = await models.getMahasiswaById(req.params.id);
  if(cekData == "" || cekData == "Query Failed") {
    res.status(404)
    res.send("<h1>404</h1>")
  } else {
    models.DeleteDataMahasiswa(req.params.id);
    req.flash('msg', 'Data Contact Berhasil Di Hapus!');
    res.redirect('/mahasiswa');
  }
})

app.get('/mahasiswa/edit/:id', async (req, res) => {
  const mahasiswaById = await models.getMahasiswaById(req.params.id);
  
  if(mahasiswaById == "" || mahasiswaById == "Query Failed") {
    res.status(404);
    res.send("<h1>404</h1>")
  } else {
    res.render('mahasiswa-edit', {
      title: "Edit Data Mahasiswa Page",
      layout: 'layout/main-layout',
      mahasiswaById: mahasiswaById,
    });
  }
  
})

app.post('/mahasiswa/edit', [
    body('nama').custom(value => {
      if(value == "") {
        throw new Error("Field Nama Harus Diisi!");
      }
      return true;
    }),
    
    body('email').custom(value => {
      if(value == "") {
        throw new Error("Field Email Harus Diisi!");
      }
      return true;
    }),
    
    check('email', 'Field Email Tidak Valid').isEmail(),
    
    check('nama', 'Field Nama Minimal Harus 3 Karakter').isLength({ min:3 }),
  ], async (req, res) => {
  
  const errors = validationResult(req);
  const mahasiswaById = await models.getMahasiswaById(req.body.id)
  
  if(!errors.isEmpty()) {
    res.render('mahasiswa-edit', {
      title: "Edit Data Mahasiswa Page",
      layout: 'layout/main-layout',
      mahasiswaById: mahasiswaById,
      errors: errors.array(),
    })
    
  } else {
    models.EditDataMahasiswa(req.body);
    req.flash('msg', 'Data Contact Berhasil Di Edit!');
    res.redirect('/mahasiswa');
    
  }
  
})

app.get('/mahasiswa/:id', async (req, res) => {
    const mahasiswaById = await models.getMahasiswaById(req.params.id);
    
    res.render('DetailMahasiswa', {
      title: "Detail Mahasiswa Page",
      layout: 'layout/main-layout',
      mahasiswaById: mahasiswaById,
    });
  
});

app.use('/', (req, res) => {
  res.status(404);
  res.send('<h1>404 Page Not Found</h1>');
})


app.listen(port, () => {
  log(`Server Is Running Location : localhost:${port}`);
})
