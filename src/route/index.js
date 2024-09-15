// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Track {
  static #list = []; //стат.приват.поле для зберіг.списку обєкта Track

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000) ; //генеруєм ID
    this.name = name; 
    this.author = author;
    this.image = image;
  }

  //Стат.метод для створ.обєкта Track і додавання його до списку #list
  static create(name, author, image) {
    const newTrack = new Track(name, author, image);
    this.#list.push(newTrack);
    return newTrack;
  }

  //Статичний метод для отримання всього списку треків
  static getList() {
    return this.#list.reverse();
  }

  static getById(id) {  // по ідент-ру знайти певний track
    return (
      Track.#list.find(
        (track) => track.id === id,
      ) || null
    );
  }

//   addTrack(track) {
//     this.tracks.push(track);
//   }
}

Track.create(
  'Інь Ян',
  'Monatik i Roxolana',
  'https://picsum.photos/100/100',
);
Track.create(
  'Baila Conmigo',
  'Selena gomez i Raul Alexandro',
  'https://picsum.photos/100/100',
);
Track.create(
  'Shameless',
  'Camilla Cabelo',
  'https://picsum.photos/100/100',
);
Track.create(
  'Dakiti',
  'Bad Bunny i Jay',
  'https://picsum.photos/100/100',
);
Track.create(
  '11 PM',
  'Maluma',
  'https://picsum.photos/100/100',
);
Track.create(
  'Інша любов',
  'EnLeo',
  'https://picsum.photos/100/100',
);

console.log(Track.getList());
// ================================================================

class Playlist {
  static #list = []; //стат.приват.поле для зберіг.списку обєкта Playlist

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000) ; //генеруєм ID
    this.name = name; 
    this.tracks = []; //список треків додані до плейліста
    this.image = 'https://picsum.photos/100/100';
  }

  //Стат.метод для створ.обєкта Playlist і додавання його до списку #list
  static create(name) {
    const newPlaylist = new Playlist(name); //створ плейліст
    this.#list.push(newPlaylist);  //додаємо в плейліст обєкти 
    return newPlaylist;
  }

  //Статичний метод для отримання всього списку плейлістів
  static getList() {
    return this.#list.reverse();
  }

  static makeMix(playlist) {   // приймає обєкт плейліст створений
    const allTracks = Track.getList();  //отримує список всіх треків
    
    let randomTracks = allTracks   //бере любі треки
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);                    // обрізає,щоб залишилися 3 треки

    playlist.tracks.push(...randomTracks);   //  додаємо через кому всі аргументи командою .push(...)
  }

  static getById(id) {  // по ідент-ру знайти певний плейліст
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    );
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    );
  }

  addTrack(track) {
    this.tracks.push(track);
  }

}

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-choose', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-choose',
    data: {},
  });
  // ↑↑ сюди вводимо JSON дані
});

// ================================================================

router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix; // перевіримо чи є isMix в посиланні
  console.log(isMix);  // приходить true в консоль
  res.render('spotify-create', {
    style: 'spotify-create',
    data: {
      isMix,
    },
  });
});

// ================================================================

router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix; // перевіримо чи є isMix в посиланні
  const name = req.body.name;  //витягнули через body назву
  if(!name) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Введіть назву плейліста',
        link: isMix 
        ? '/spotify-create?isMix=true'
        : '/spotify-create',
      },
    });
  }

  const playlist = Playlist.create(name) //створ.плейліста в ендпоінті spotify-create 
  
  if(isMix) {                     
    Playlist.makeMix(playlist)
  }
  console.log(playlist); // виводить плейліст з інформацією "успішно"

  res.render('spotify-playlist', {  // виведе data,якщо є плейліст
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,  
      tracks: playlist.tracks,
      name: playlist.name,
    },
  });
});

  //     res.render('alert', {
  //     style: 'alert',
  //     data:{
  //       message: 'Успішно',
  //       info: 'Плейліст створено',
  //       link: `/spotify-playlist?id=${playlist.id}`,
  //     },
  //   })
  // })
// ================================================================

router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id); // отримали ідент.ID з query
  console.log('Получимо плейліст з id:', id);
  const playlist = Playlist.getById(id); // отримали по ідент.ID плейліст
  
  if (!playlist) {  // якщо нема плейліст-видає помилку
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено spotify-playlist',
        link: '/',
      },
    });
  }
  
  res.render('spotify-playlist', {  // виведе data,якщо є плейліст
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,  
      tracks: playlist.tracks,
      name: playlist.name,
    },
  });
});


// ================================================================

router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId);
  const trackId = Number(req.query.trackId);
  const playlist = Playlist.getById(playlistId);

  if(!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: { 
        message: 'Помилка',
        info: 'Такого плейліста не знайдено spotify-track-delete',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    });
  }

  playlist.deleteTrackById(trackId);

  res.render('spotify-playlist', {  
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,  
      tracks: playlist.tracks,
      name: playlist.name,
    },
  });
});

// ================================================================

//Роут для відображения стор додавання трека в плейлист
router.get('/spotify-playlist-add', function (req, res) {
  const playlistId = Number(req.query.playlistId); // отримали ідент.ID з query
  const playlist = Playlist.getById(playlistId); // отримали по ідент.ID плейліст
  const trackId = Number(req.query.trackId);
  

  console.log('Получимо плейліст з id:', playlistId,trackId);

  if(!playlist) {  // якщо нема плейліст-видає помилку
    return res.render('alert', {
      style: 'alert',
      data:{
        message: 'Помилка',
        info: 'Такого плейліста не знайдено spotify-playlist-add-get',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  const tracks = Track.getList(); // Получаєм всі треки, які можна додавти
  res.render('spotify-playlist-add', {  // виведе data,якщо є плейліст
    style: 'spotify-playlist-add',
    data:{
      playlistId: playlist.id,  
      tracks: tracks,
      name: playlist.name,
    }
  })
});

// Роут для обробки додавання трека в плейлист
router.post('/spotify-playlist-add', function (req, res) {
  const playlistId = Number(req.body.playlistId);
  const trackId = Number(req.body.trackId);
  const playlist = Playlist.getById(playlistId);
  const track = Track.getById(trackId);
  console.log('Получимо плейліст id, трек:', playlistId,trackId);

  if (!playlist) {
      return res.render('alert', {
      style: 'alert',
      data: {
          message: 'Помилка',
        info: 'Такого плейліста не знайдено spotify-playlist-add-post',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    });
  }

  if (!track) {
      return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого трека не найдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    });
  }

  playlist.addTrack(track); // Добавляєм трек в плейлист

  res.render('spotify-playlist', {  // Відображаєм обновлений плейлист
      style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  });
});

// ================================================================



router.get('/spotify-playlists', function (req, res) {
  const playlists = Playlist.getList(); // Получаємо список всіх плейлистів
  res.render('spotify-playlists', { // Відправляємо дані на шаблон
    style: 'spotify-playlists',
    data: {
      playlists, // Передаємо список плейлистів в шаблон
    },
  });
});

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
