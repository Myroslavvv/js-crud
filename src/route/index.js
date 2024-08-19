// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
  static #list = []; //Це оголошення приватного статичного поля #list, яке є масивом. Приватні поля позначаються символом # і доступні тільки всередині класу.

  constructor(name, price, description) {
    this.id = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    // this.id = new Date().getTime();
    this.name = name;
    this.price = price;
    this.description = description;
  }

  // verifyPassword = (password) => this.password === password

  //Це статичний метод add, який приймає параметр product і додає його до масиву #list за допомогою методу push.
  static add = (product) => {
    this.#list.push(product);
  }
  
  static getList = () => this.#list;
  
  static getById = (id) =>
  this.#list.find((product) => product.id === id);
  
  // static deleteById = (id) => {
  //   const product = this.getById(id)
  //   if (product) {
  //     if (id) {
  //       product.id = id
  //     }
  //     return true
  //   } else {
  //     return false
  //   }
  // };


 
  static deleteById = (id) => {
    const index = this.#list.findIndex((product) => product.id === id);
    if (index !== -1) {
      this.#list.splice(index, 1); // Удаляем продукт из массива
      return true; // Возвращаем true, если продукт был удален
    }
    return false; // Возвращаем false, если продукт не найден
  };

  
  static updateById = (
    id,
    { name, price, description },
    ) => {
      const product = this.getById(id)
      if (product) {
        if ((name, price, description)) {
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

    // console.log(Product.getList()); // Выводит массив продуктов/
    // console.log(`Product ID: ${productId}`); // Проверка ID продукта

router.get('/product-create', (req, res) => {
  res.render('product-create')
})

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body
  const product = new Product(name, price, description) //створюється новий екземпляр класу Product з переданими параметрами name, price та description
  Product.add(product) //Викликається статичний метод add класу Product, щоб додати новий продукт до масиву #list.
  console.log(Product.getList()) //Виводиться в консоль результ.виклику методу getList, який повертає масив #list
  res.render('alert', {
    style: 'alert',
    info1: 'Успішне виконання дії',
    info2: 'Товар створений',
  })
})

// ================================================================

router.get('/product-list', (req, res) => {
  const list = Product.getList()
  const isEmpty = list.length === 0
  res.render('product-list', {
    style: 'product-list',
    data: {
      products: {
        list,
        isEmpty,
      },
    },
  })
})

// router.post('/product-list', function (req, res) {
//   const list = Product.getList()
//   res.render('product-list', {
//     style: 'product-list',
//     data: {
//       products: {
//         list,
//         isEmpty: list.length === 0,
//       },
//     },
//   })
// })

// ================================================================

router.get('/product-edit', (req, res) => {
  const { id } = req.query
  const product = Product.getById(Number(id))
  if (product) {
    res.render('product-edit', {
      style: 'product-edit',
      data: {
        product: product,
      },
    })
  } else {
    res.status(404).render('error', {
      style: 'error',
      message: 'Продукт не знайдено з таким ID',
    })
  }
})

router.post('/product-edit', (req, res) => {
  const id = Number(req.body.id)
  const { name, price, description } = req.body
  const product = Product.getById(id)
  if (product) {
    Product.updateById(id, { name, price, description })
    res.render('alert', {
      style: 'alert',
      info6: 'Продукт оновлено успішно',
    })
  } else {
    res.status(404).send('Продукт не знайдено')
  }
});

// router.post('/product-edit', (req, res) => {
//   const id = Number(req.body.id)
//   const { name, price, description } = req.body
//   if (!price) {
//   if (!name || !price || !description) {
//   const product = Product.getById(id)
//   if (product) {
//     Product.updateById(id, { name, price, description })
//     res.render('alert', {
//       style: 'alert',
//       info6: 'Продукт оновлено успішно',
//     })
//   } else {
//     res.status(404).send('Продукт не знайдено')
//   }
//   } else {
//   res.status(404).send('Нема ціни продукта');
//   }
// })

// router.post('/product-edit', (req, res) => {
//   try {
//     const { id, name, price, description } = req.body;

//     if (!id || !name || !price || !description) {
//       return res.status(400).send('Все поля являются обязательными');
//     }

//     // Проверка, является ли цена числом
//     if (isNaN(price)) {
//       return res.status(400).send('Цена должна быть числом');
//     }

//     const product = Product.getById(Number(id));
//     if (product) {
//       Product.updateById(id, { name, price, description });
//       res.render('alert', {
//         style: 'alert',
//         info6: 'Продукт обновлен успешно',
//       });
//     } else {
//       res.status(404).send('Продукт не найден');
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Произошла ошибка на сервере');
//   }
// });

// console.log(name, price, id, description);

// router.get('/product-edit', (req, res) => {
// const {id} = req.query;        //отримати з req.query властивість id
// Product.getById(Number(id));    //
// const id = req.query.id;
// const product = new Product(price, description);
// Product.add(product);
// console.log(Product.getList());
// res.render('product-edit', {
// style: '/product-edit',
// info3: "Товар з таким ID не знайдено",
// info3: result ? "Дані редаговано" : "Сталася помилка",
// });
// });

// router.post('/product-edit', function (req, res) {
//   const {name, price, description} = req.body;
//   const product = new Product(name, price, description);
//   Product.add(product);
//   console.log(Product.getList());
//   res.render('alert', {
//     style: 'alert',
//     info1: "Успішне виконання дії",
//     info2: "Товар створений"
//   })
// })

// router.post('/product-edit', function (req, res) {
//   const {name, price, id, description} = req.body;
//   console.log(name, price, id, description);

//   const result = Product.updateById(Number(id), {name}, {price}, {description})
//   res.render('alert', {
//     style: 'alert',
//     // info1: "Успішне виконання дії",
//     info4: result ? "Дані редаговано" : "Сталася помилка",
//   });
// });

// ================================================================
// router.get('/product-delete', function (req, res) {
//   const { id } = req.query;
//   Product.deleteById(Number(id)); 
  
//   res.render('alert', {
//     style: 'alert',
//     info1: 'Успішне виконання дії',
//     info4: 'Товар видалений',
//   })
// });

// router.get('/product-delete', function (req, res) {
//   const { id } = req.query;
//   const success = Product.deleteById(Number(id)); // Проверка успешности удаления
//   if (success) {
//     res.render('alert', {
//       style: 'alert',
//       info1: 'Успішне виконання дії',
//       info4: 'Товар видалений',
//     });
//   } else {
//     res.render('alert', {
//       style: 'alert',
//       info1: 'Помилка',
//       info4: 'Товар не знайдено',
//     });
//   }
// });

router.get('/product-delete', function (req, res) {
  const { id } = req.query;
  const isDeleted = Product.deleteById(Number(id));
  
  if (isDeleted) {
    res.render('alert', {
      style: 'alert',
      info1: 'Успішне виконання дії',
      info4: 'Товар видалений',
    });
  } else {
    res.render('alert', {
      style: 'alert',
      info1: 'Помилка',
      info4: 'Товар не знайдено',
    });
  }
});


// router.get('/product-delete', async function (req, res) {
//   const { id } = req.query;
//   try {
//     await Product.deleteById(Number(id));
//     res.render('alert', {
//       style: 'alert',
//       info1: 'Успішне виконання дії',
//       info4: 'Товар видалений',
//     });
//   } catch (error) {
//     res.render('alert', {
//       style: 'alert',
//       info1: 'Помилка',
//       info4: 'Не вдалося видалити товар',
//     });
//   }
// });
// ================================================================
// router.get('/user-delete', function (req, res) {
//   const{id} = req.query                     //req.query-при get отримання даних з строки запроса браузера(часть URL после символа ?(напр.?id=123)
//   User.deleteById(Number(id))                 //(deleteById - знаходяться в класі class User)
//   res.render('success-info', {
//     style: 'success-info',
//     info: "Користувач видалений",
//   })
// })

// router.post('/product-delete', function (req, res) {
//   const {name, price, id, description} = req.body;
//   console.log(name, price, id, description);

//   const result = Product.deleteById(Number(id), {name}, {price}, {description})
//   res.render('alert', {
//     style: 'alert',
//     // info1: "Дані редаговано",
//     info5: result ? "Товар виделено" : "Сталася помилка",
//   });
// });

// ================================================================
// Підключаємо роутер до бек-енду
module.exports = router
