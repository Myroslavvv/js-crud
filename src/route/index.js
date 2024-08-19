// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
  static #list = []; //Це оголошення приватного статичного поля #list, яке є масивом. Приватні поля позначаються символом # і доступні тільки всередині класу.

  constructor(name, price, description) {
    this.id = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    this.name = name;
    this.price = price;
    this.description = description;
  }

  //Це статичний метод add, який приймає параметр product і додає його до масиву #list за допомогою методу push.
  static add = (product) => {
    this.#list.push(product);
  }
  
  static getList = () => this.#list;
  
  static getById = (id) =>
  this.#list.find((product) => product.id === id);
  
  static deleteById = (id) => {
    const index = this.#list.findIndex((product) => product.id === id);
    if (index !== -1) {
      this.#list.splice(index, 1); // Видаляєм продукт із масива
      return true; // повертаєм true, якщо продукт видалено
    }
    return false; // повертаєм false, якщо продукт не знайдено
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
        return true
      } else {
        return false
      }
    }
    
}

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

// ================================================================

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

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
