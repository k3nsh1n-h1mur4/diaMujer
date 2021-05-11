const bcrypt = require('bcrypt');


/* const fs = require('fs')

const getFile = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, data) => {
      if (err) {
        reject(err)  // calling `reject` will cause the promise to fail with or without the error passed as an argument
        return        // and we don't want to go any further
      }
      resolve(data)
    })
  })
}

getFile('/etc/passwd')
.then(data => console.log(data))
.catch(err => console.error(err)) */


const getBcryptPass = (pass, rounds) => {            //cuando se pasen los valores de pass y rounds
  return new Promise((resolve, reject) => {
    bcrypt.hash(pass, rounds, (err, hash) => {
      if(err){
        reject(err)
        return
      }
      resolve(hash)
    });
  });         
}

getBcryptPass('abimael', 10)
  .then(hash => console.log(hash))
  .catch(err => console.log(err))



/* function printR(r) {
  bcryptP(result);
}

function bcryptP(pass, s){
  return this.pass = bcrypt.hash(pass, s);
}

let result = bcryptP('isaac', 10);
function printResult (r){
  result()
}
function k(password, salt){
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
    const h = hash;
    console.log(h);
    return hash;
  });
}

let a = bcryptP('fsdf', 10, (err, hash) => {
  console.log(hash);

});
console.log(a);

k('isaac', 10);
const f = k('gig', 10);
console.log(f);
 */



