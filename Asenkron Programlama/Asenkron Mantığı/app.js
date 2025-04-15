/*
1-Javascript senkron çalışan bir programlama dilidir.

1-Timing 
2-Event(Olay)
3-Http istekelerinde

*/
// selamla();
// console.log("1");
// console.log("2");
// console.log("Enes");

// function selamla() {
//   console.log("Selam");
// }

//Asenkron
//setTimeout(() => {}, timeout);

//ASENKRON PROBLEMİ

//https istekleri

const users = [
  {
    userId: 5,
    post: "Enes Post 1",
  },
  {
    userId: 5,
    post: "Enes Post 2",
  },
  {
    userId: 5,
    post: "Enes Post 3",
  },
  {
    userId: 6,
    post: "Enes Post 1",
  },
  {
    userId: 7,
    post: "Betül Post 1",
  },
];

//user id
//post by user id

function getUserId() {
  setTimeout(() => {
    //Servise gittik ve cevabı aldık.
    return 5;
  }, 1000);
}

function getPostByUserId(userId) {
  console.log(userId);
  //Gerçek bir rest api ya istek atacaksınız
  setTimeout(() => {
    users.forEach((user) => {
      if (user.userId === userId) {
        console.log(user.post);
      }
    });
  }, 500);
}

let userId = getUserId();
getPostByUserId(userId);
