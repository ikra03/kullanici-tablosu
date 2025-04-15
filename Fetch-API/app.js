//?----------FETCH API -------------

//callback - promise
//ajax(xmlhttprequest) - fetch api

//console.log(this);

// function getStudents(url) {
//   fetch(url)
//     .then((response) => {
//       return response.json();
//     })
//     .then((data) => console.log(data))
//     .catch((err) => console.log(err));
// }

// getStudents("students.json");  (2) [{…}, {…}]
// 0
// :
// {id: 1, firstname: 'ikra', lastname: 'Sezgek'}
// 1
// :
// {id: 2, firstname: 'Enes', lastname: 'Bayram'}
// length
// :
// 2
// [[Prototype]]
// :
// Array(0) konsolda çıkan bu.

function getData(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
}

getData("https://jsonplaceholder.typicode.com/users");
