// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
  
  static #list = [];

  constructor(name, price, description) {
    this.id = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    // this.createDate = new Date().toISOString();
    this.name = name; 
    this.price = price;
    this.description = description;
  }

  // verifyPassword = (password) => this.password === password

  static add = (product) => {
  this.#list.push(product)
  }
  
  static getList = () => this.#list
  

  static getById = (id) => 
    this.#list.find((product) => product.id === id)
  
  // static deleteById = (id) => {
  //   const index =  this.#list.findIndex( 
  //     (product) => product.id === id,
  //     )
  //     if(index !== -1) {
  //       this.#list.splice(index, 1)
  //       return true
  //     } else {
  //       return false
  //     }
  //   }

  static deleteById = (id) => {
    const product = this.getById(id)
      if(product) {
        if (id) {
          product.id = id
      }
          return true
          } else {
          return false
        }
      }

  static updateById = (id, {name}, {price}, {description}) => {
    const product =  this.getById(id)
      if(product) {
        if (name, price, description) {
          product.name = name
          product.price = price
          product.description = description
      }
        // this.update(product, {name})
          return true
          } else {
          return false
        }
      }

        // static update = (user, {email}) => {
        //   if(email) {
        //     user.email = email
        //   }
  }
// ================================================================

// router.get('/product-create', function (req, res) {
//   const{id} = req.query
//   User.deleteById(Number(id))
//   res.render('success-info', {
//     style: 'success-info',
//     info: "Користувач створений",
//   })
// })

// ================================================================

// router.post('/product-create', function (req, res) {
//   const{createDate, name, price, description} = req.body
//   let result = false;
//   const user = Product.getById(Number(id))
//   if(product.verifyPassword(password)) {
//     Product.update(product, {email})
//     result = true;
//   }
  
//   res.render('success-info', {
//     style: 'success-info',
//     info: result ? "Емайл пошта оновлена" : "Сталася помилка",
//   })
// })


// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = Product.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/product-create', function (req, res) {
  const {name, price, description} = req.body;
  const product = new Product(name, price, description);
  Product.add(product);
  console.log(Product.getList());
  res.render('alert', {
    style: 'alert',
    info1: "Успішне виконання дії",
    info2: "Товар створений"
  })
})

// ================================================================

// router.get('/product-delete', function (req, res) {
//   const {id} = req.query;
//   Product.deleteById(Number(id));

//   res.render('alert', {
//     style: 'alert',
//     info1: "Успішне виконання дії",
//     info2: "Товар видалений"
//   })
// })

// ================================================================

router.post('/product-delete', function (req, res) {
  const {name, price, id, description} = req.body;
  console.log(name, price, id, description);

  const result = Product.deleteById(Number(id), {name}, {price}, {description})
  res.render('alert', {
    style: 'alert',
    // info: "Дані редаговано",
    info1: result ? "Дані редаговано" : "Сталася помилка",
  })
})

// ================================================================

router.post('/product-edit', function (req, res) {
  const {name, price, id, description} = req.body;
  console.log(name, price, id, description);

  const result = Product.updateById(Number(id), {name}, {price}, {description})
  res.render('alert', {
    style: 'alert',
    // info: "Дані редаговано",
    info1: result ? "Дані редаговано" : "Сталася помилка",
  })
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
