const { conn } = require('../databases/database');
const log = console.log;

const getMahasiswa = async () => {
  return new Promise((resolve, reject) => {
  const sql = "SELECT * FROM mahasiswa";
    
    conn.query(
      sql,
      (err, result) => {
        
        if(err) {
          return reject(err);
        }
        return resolve(result);
        
      }
    );
    
  })
}

const getMahasiswaById = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM mahasiswa WHERE id = ${id}`;
      conn.query(
        sql,
        (err, result) => {
          if(err) {
            return resolve("Query Failed")
          }
          return resolve(result)
        }
      )
  })
}

const CreateDataMahasiswa = async (data) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO `mahasiswa` (`id`, `nama`, `email`) VALUES (NULL, '"+data.nama+"', '"+data.email+"');";
      conn.query(
        sql,
        (err, result) => {
          if(err) {
            return reject(err);
          }
          return resolve(result)
        }
      )
  })
}

const DeleteDataMahasiswa = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM `mahasiswa` WHERE `mahasiswa`.`id` = "+ id;
      conn.query(
        sql,
        (err, result) => {
          if(err) {
            return reject(err);
          }
          return resolve(result)
        }
      )
  })
}

const EditDataMahasiswa = async (data) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE `mahasiswa` SET `nama` = '"+ data.nama +"', `email` = '"+ data.email +"' WHERE `mahasiswa`.`id` = "+ data.id +";";
    conn.query(
      sql,
      (err, result) => {
        if(err) {
          return reject(err);
        } else {
          return resolve(result);
        }
      }
    )
  })
}

module.exports = {
  getMahasiswa,
  getMahasiswaById,
  CreateDataMahasiswa,
  DeleteDataMahasiswa,
  EditDataMahasiswa,
}
