// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Product {
  static #list = [];
  
  static #count = 0;

  constructor(img, title, description, category, price, amount = 0) {
    this.id = ++Product.#count; //генеруєм ID для товару
    this.img = img;
    this.title = title;
    this.description = description;
    this.category = category;
    this.price = price;
    this.amount = amount;
  }

  static add = (...data ) => {
    const newProduct = new Product(...data)

	this.#list.push(newProduct)
  }

  static getList = () => {
	return this.#list
  }

  static getById = (id) => {
	return this.#list.find((product) => product.id === id)
  }

  static getRandomList = (id) => {
	// фільтруємо товари, щоб вилучити той, з яким порівнюємо id
	const filteredList = this.#list.filter((product) => product.id !== id)
	// відсортуємо за допомогою Math.random() та перемішаємо масив
	const shuffledList = filteredList.sort(() => Math.random() - 0.5)
	// повертаємо перші 3 елементи з перемішаного масиву
	return shuffledList.slice(0, 3)
  }
}

  Product.add(
	'https://picsum.photos/200/300',
	'Комп Artline Gaming AMD S 3600/',
	'AMD Ryaen s 36(3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ/ nvidia GeForce',
	[
		{ id: 1, text: 'Готовий до відправки'},
		{ id: 2, text: 'Топ продажів'},
	],
	27000,
  10,
  )

  Product.add(
	'https://picsum.photos/200/300',
	'Комп Proline Busines Intel Core i5 9400F/',
	'Intel Core i5 9400F(2.9 - 4.1 ГГц) / RAM 8 ГБ / HDD 1 ТБ / nvidia GeForce',
	[
		{ id: 2, text: 'Топ продажів'},
	],
	20000,
  10,
  )

  Product.add(
	'https://picsum.photos/200/300',
	'Комп Proline Workstation Intel Xeon E-2226G/',
	'Intel Xeon E-2226G(3.4 - 4.7 ГГц) / RAM 16 ГБ / SSD 512 ГБ/ nvidia GeForce',
	[
		{ id: 1, text: 'Готовий до відправки'},
	],
	40000,
  10,
  )

  class Purchase {
    static DELIVERY_PRICE = 150;
    static #BONUS_FACTOR = 0.1;

    static #count = 0;
    static #list = [];

    static #bonusAccount = new Map();

    static getBonusBalance = (email) => {
      return Purchase.#bonusAccount.get(email) || 0
    }

    static calcBonusAmount = (value) => {
      return value * Purchase.#BONUS_FACTOR
    }

    static updateBonusBalance = (
      email,
      price,
      bonusUse = 0,
    ) => {
      const amount = this.calcBonusAmount(price);
      const currentBalance = Purchase.getBonusBalance(email);
      const updateBalance = currentBalance + amount - bonusUse
      Purchase.#bonusAccount.set(email, updateBalance);
      console.log(email, updateBalance);
      return amount;
    }

    constructor(data, product) {
      this.id = ++Purchase.#count;

      this.firstname = data.firstname;
      this.lastname = data.lastname;

      this.phone = data.phone;
      this.email = data.email;
      
      this.comment = data.comment || null;
      
      this.bonus = data.bonus || 0;

      this.promocode = data.promocode || null;
      
      this.totalPrice = data.totalPrice;
      this.productPrice = data.productPrice;
      this.deliveryPrice = data.deliveryPrice;
      this.amount = data.amount;
      
      this.product = product;
    }

    static add = (...arg) => {
      const newPurchase = new Purchase(...arg)
      this.#list.push(newPurchase);
      return newPurchase;
    }

    static getList = () => {
      return Purchase.#list;
      // return Purchase.#list.reverse();
      // .map(({id, name, price, bonus}) => ({id, name, price, bonus}));
    }

    static getById = (id) => {
      return Purchase.#list.find((item) => item.id === id)
    }

    static updateById = (id, data) => {
      const purchase = Purchase.getById(id)
      if(purchase) {
        if(data.firstname) purchase.firstname = data.firstname
        if(data.lastname) purchase.lastname = data.lastname
        if(data.phone) purchase.phone = data.phone
        if(data.email) purchase.email = data.email

        return true
      } else {
        return false
      }
    }
  }

  class Promocode {
    static #list = [];
  
    constructor(name, factor) {
      this.name = name;
      this.factor = factor;
    }

    static add = (name, factor) => {
      const newPromoCode = new Promocode(name, factor);
      Promocode.#list.push(newPromoCode);
      return newPromoCode;
    }

    static getByName = (name) => {
      return this.#list.find((promo) => promo.name === name);
    }

    static calc = (promo, price) => {
      return price * promo.factor;
    }
  }
  Promocode.add('SUMMER2023', 0.9)
  Promocode.add('DISCOUNT50', 0.5)
  Promocode.add('SALE25', 0.25)

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-index',

    data:{
      list: Product.getList(),
    },
  
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.get('/purchase-product', function (req, res) {
	const id = Number(req.query.id);
  
	// ↙️ cюди вводимо назву файлу з сontainer
	res.render('purchase-product', {
	  // вказуємо назву папки контейнера, в якій знаходяться наші стилі
	  style: 'purchase-product',
  
	  data:{
      list: Product.getRandomList(id),
      product: Product.getById(id),
	  },
	})
	// ↑↑ сюди вводимо JSON дані
  })
  
  // ================================================================

router.post('/purchase-create', function (req, res) {
  // console.log(req.body);

	const id = Number(req.query.id);
  const amount = Number(req.body.amount);

  // console.log(id,amount);

  if(amount < 1) {
    res.render('alert', {
      style: 'alert',
      data:{
        message: "Помилка",
        info: "Некоректна кількість товару",
        link:  `/purchase-product?id=${id}`,
      },
    })
  }

  const product = Product.getById(id);

  if(product.amount < 1) {
    return res.render('alert', {
      style: 'alert',
      data:{
        message: "Помилка",
        info: "Такої кількості товару нема в наявності",
        link:  `/purchase-product?id=${id}`,
      },
    })
  }

  console.log(product, amount);

  const productPrice = product.price * amount;
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE;
  const bonus = Purchase.calcBonusAmount(totalPrice);
  
  res.render('purchase-create', {
	  style: 'purchase-create',
  
	  data:{
      id: product.id,
      cart: [
        {
          text: `${product.title} (${amount} шт)`,
          price: productPrice,
        },
        {
          text: `Доставка`,
          price: Purchase.DELIVERY_PRICE,
       },
     ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
	})
})

  
  // ================================================================
  
  router.post('/purchase-submit', function (req, res) {
    const id = Number(req.query.id)

    let {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,

      firstname,
      lastname,
      email,
      phone,

      comment,
      bonus,
      promocode,
    } = req.body

    const product = Product.getById(id)

    if(!product) {
      return res.render('alert', {
      style: 'alert',
    
      data:{
        message: "Помилка",
        info: "Товар не знайдено",
        link:  `/purchase-list`,
      },
    })
  }

  if(product.amount < amount) {
    return res.render('alert', {
    style: 'alert',
  
    data:{
      message: "Помилка",
      info: "Товару нема в потрібній кількості",
      link:  `/purchase-list`,
    },
  })
}

  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  if(
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render('alert', {
      style: 'alert',
    
      data:{
        message: "Помилка",
        info: "Некоректні дані",
        link:  `/purchase-list`,
        
      },
    }) 
  }

  if(!firstname || !lastname || !email || !phone) {
    return res.render('alert', {
      style: 'alert',
    
      data:{
        message: "Заповніть обов*язкові поля",
        info: "Некоректні дані",
        link:  `/purchase-list`,
      },
    }) 
  }

  if(bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email);
    console.log(bonusAmount);
    if(bonus > bonusAmount) {
      bonus = bonusAmount;
    }
    Purchase.updateBonusBalance(email, totalPrice, bonus)
    totalPrice -= bonus
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  if(promocode) {
    promocode = Promocode.getByName(promocode)

    if(promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  if(totalPrice < 0) totalPrice = 0
  // try { ///////////////
  const purchase = Purchase.add(
    {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    email,
    phone,

    comment,
    bonus,
    promocode,
    },
    product,
  );

  console.log(purchase);

  res.render('alert', {
    style: 'alert',
  
    data:{
      message: "Успішно",
      info: "Замовлення створено",
      link:  `/purchase-list`,
    },
  }) 
// } catch (error) { ///////
//   console.error(error);
//   res.render('alert', {
//       style: 'alert',
//       data: {
//           message: "Помилка",
//           info: "Не вдалося створити замовлення",
//           link: `/purchase-list`,
//       },
//   });
// }/////////

})

  // ================================================================

  router.get('/purchase-list', function (req, res) {
    const purchases = Purchase.getList();
    
    res.render('purchase-list', {
      style: 'purchase-list',
    
      data:{
        purchases,
      },
    });
  });
    
    // ================================================================
    
    router.get('/purchase-info', function (req, res) {
      const id = Number(req.query.id);
      const info = Product.getById(id);
      const purchase = Purchase.getById(id); 
      
      // if (!info) {  // Провіряємо, чи існує info
      //   return res.render('alert', {
      //     style: 'alert',
      //     data: {
      //       message: "Помилка",
      //       info: "Товар не знайдено",
      //       link: `/purchase-list`,
      //     },
      //   });
      // }
    
      // if (!purchase) { // Провіряємо, чи існує purchase
      //   return res.render('alert', {
      //     style: 'alert',
      //     data: {
      //       message: "Помилка",
      //       info: "Замовлення не знайдено",
      //       link: `/purchase-list`,
      //     },
      //   });
      // }

      res.render('purchase-info', {
        style: 'purchase-info',
        data: {
          info: info,
          firstname: purchase.firstname,
          lastname: purchase.lastname,
          phone: purchase.phone,
          email: purchase.email,
          title: purchase.product.title,
          comment: purchase.comment,
          productPrice: purchase.productPrice,
          deliveryPrice: purchase.deliveryPrice,
          totalPrice: purchase.totalPrice,
          bonus: purchase.bonus,
        },
      });
    });
    
    // ================================================================
    
    router.get('/purchase-edit', (req, res) => { //////редагування товару
      const id = Number(req.query.id || req.body.id);

      // const rawId = req.query.id || req.body.id;
      // console.log('Значення ID до конвертації:', rawId);
      // const id = Number(rawId);
      console.log('Значення ID після конвертації:', id);
      
      const info = Product.getById(id);

      if (isNaN(id)) {
        console.error('ID є некоректним:', id);
      }

      const purchase = Purchase.getById(Number(id));

      if (purchase) {
        res.render('purchase-edit', {
          style: 'purchase-edit',
          data: {
            purchase: purchase,
          },
        })
      } else {
        res.status(404).render('error', {
          style: 'error',
          message: 'Продукт не знайдено з таким ID',
        })
      }
    })
    
    router.post('/purchase-edit', (req, res) => {
      const id = Number(req.body.id);
      const {firstname, lastname, phone, email} = req.body;
      const purchase = Purchase.getById(id);
      if (purchase) {
        Purchase.updateById(id, {firstname, lastname, phone, email});
        res.render('alert', {
          style: 'alert',
          data: {
            message: "Успішно",
            info6: 'Продукт оновлено успішно',
            link: `/purchase-info?id=${id}`, // Перенаправлення на сторінку з інформацією про замовлення
          },
        })
      } else {
        res.status(404).render('alert', {
          style: 'alert',
          data: {
            message: "Помилка",
            info: "Замовлення не знайдено",
            link: `/purchase-list`,
          },
        });
      }
    });

    // ================================================================
    
// Підключаємо роутер до бек-енду
module.exports = router
