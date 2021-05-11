const PDFDocument = require('pdfkit');
const fs = require('fs');
const bcrypt = require('bcrypt');
const qrcode = require('qrcode');
const path = require('path');



const controllers = {};

controllers.index = (req, res) => {
    res.render('index');
}


controllers.getUserForm = (req, res) => {
    res.render('registerUser');
}


controllers.createUser = (req, res) => {
    const pass = req.body.password
    const getBcryptPass = (password, rounds) => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, rounds, (err, hash) => {
                if(err){
                    reject(err)
                    return
                }
                resolve(hash)
            });
        });
    }

    getBcryptPass(pass, 10)
        //.then(hash => console.log(hash))
        .then(hash => req.getConnection((err, conn) => {
            const newUser = {
                username: req.body.username,
                password: hash,
                email: req.body.email
            }
            conn.query('INSERT INTO users(`username`, `password`, `email`) VALUES(?, ?, ?)', [newUser.username, newUser.password, newUser.email], (err, result) => {
                if(result.affectedRows >= 1){
                    console.log('Registro realizado con exito');
                    res.redirect('register');
                }
            })
        }))
        .catch(err => console.log(err))
}


controllers.loginForm = (req, res) => {
    res.render('login')
}

controllers.login = (req, res) => {
    const { email } = req.body;
    //const pass = req.body.password;
    console.log(req.body);
        req.getConnection((err, conn) => {
            conn.query('SELECT email, password FROM users WHERE `email` = ?', [email], (err, rows) => {
              
                //console.log(rows[0].password);
                const comparePassword = (pass, hash) => {
                    return new Promise((resolve, reject) => {
                        bcrypt.compare(pass, hash, (err, result) => {
                            //return Promise.resolve(result)
                            if (err) {
                                reject(err)
                                return
                            }
                            resolve(result)
                        });
                    });
                }
                comparePassword(req.body.password, rows[0].password)
                    .then(result => {
                        if(result === true){
                            console.log("credenciales")
                            req.session.email = rows[0].email;
                            console.log(req.session)
                            
                            res.redirect('register')
                        }
                    }) 
                    .catch(err => {
                        if(result === false){
                            console.log(err)
                            res.redirect('loginForm')
                            res.end()
                        }
                    })
                });
        });
}


controllers.logout = (req, res) => {
    if(req.session.email){
        console.log('hay una sesión activa')
        req.session.destroy()
        console.log(req.session)
        res.redirect('loginForm')
    }
}

controllers.save = (req, res) => {
    if(req.method === 'GET'){
        res.render('register');
    }
    else if(req.method === 'POST'){
        res.render('register');
        let register = {
            matricula: req.body.matricula,
            nombre : req.body.nombre,
            uadscripcion: req.body.uadscripcion,
            turno: req.body.turno,
            domicilio: req.body.domicilio,
            edad : req.body.edad,
            email: req.body.email,
        }
        req.getConnection((err, conn) => {
            if(err){
                res.redirect('/errors/404');
            }
            conn.execute('INSERT INTO rDatos(`matricula`, `nombre`, `uadscripcion`, `turno`, `domicilio`, `edad`, `email`)VALUES(?, ?, ?, ?, ?, ?, ?)', [register.matricula, register.nombre, register.uadscripcion, register.turno, register.domicilio, register.edad, register.email],  (err, results) => {
                if(err){
                    console.log(err.code);
                }else
                console.log('El registro se realizo exitosamente!')
                    //res.redirect('list')
                
                
                /* console.log(results);
                console.log("El registro se realizo exitosamente!"); */
            });
            
        });
        /*console.log(register.nombre);
        console.log(register.edad);
        console.log(req.ip);
        console.log(req.hostname);
        console.log(req.body);*/
    }
    
};


controllers.list = (req, res, next) => {
    req.getConnection((err, conn) => {
        if(err){
            const e = err.code
            res.render('errors/404');
            next();
        }
        conn.query('SELECT * FROM rDatos', (err, rows) => {
            if(err){
                var er = err.code;
                res.render('errors/500', {
                    err : er,
                });
                console.log(err.code);
            }else
            res.render('list', {
                rows: rows
            });
            
        });
    });
};


controllers.delete = (req, res, next) => {
    const { id } = req.params;
    console.log(req.params);
    if(req.method === 'GET'){
        req.getConnection((err, conn) => {
            conn.query('DELETE FROM rDatos WHERE id = ?', [id], (err, results) => {
                if(err){ next();}
                else{ res.redirect('/');}
            });
        
        });
    }
};


controllers.edit = (req, res, next) => {
    const { id } = req.params;
    if(req.method === 'GET'){
        req.getConnection((err, conn) => {
            conn.execute('SELECT * FROM rDatos WHERE id = ?', [id], (err, rows)=> {
                //console.log(rows);
                if(err){ console.log(err.code);};
                res.render('edit', {
                    rows: rows[0]
                });
            });
        });
    } 
};


controllers.update = (req, res, next) => {
    const { id } = req.params;
    const newRegister = req.body;
    console.log(newRegister);
    req.getConnection((err, conn) => {
        conn.query('UPDATE rDatos set ? WHERE id = ?', [newRegister, id], (err, rows) => {
            res.redirect('/');
        });
    });

};  


controllers.qrcode = (req, res) => {
    const { id } = req.params;
    console.log(id)
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM rDatos WHERE id = ?', [id], (err, rows) => {
           
           console.log(rows[0])
           //console.log(rows[0].matricula)
           //console.log(typeof(rows[0].id)); 
           const qrcodeData = [ rows[0].matricula, rows[0].nombre, rows[0].uadscripcion ]

            qrcode.toFile('/Users/k3nsh1n/node/app/diaMujer/src/public/qrcodes/' + rows[0].nombre, qrcodeData,  (err, code) => {
                if(err){
                    console.log(err)
                }
                
                
            })
        })
    })
    res.redirect('/')
}


controllers.pdf = (req, res) => {
    const id = req.params.id;
    //const PDFDocument = new PDFDocument;
    var pdfDoc = new PDFDocument;
    pdfDoc.pipe(fs.createWriteStream('listado.pdf'));
    
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM rDatos WHERE id = ?', [id], (err, rows) => {
            console.log(id);
            console.log(rows[0].matricula);
            
            pdfDoc.text(" Folio: "+ `${id}`, 150,150);
            pdfDoc.text(rows[0].matricula);

            /*res.setHeader('Content-Disposition', 'attachment; filename=out.pdf');
            res.setHeader('Content-Type', 'application/pdf');
            console.log(res);
            doc.pipe(res.send(rows));
            doc.end();*/
            pdfDoc.end();
        });
    });
}
        
    
        
        


module.exports = controllers;
