// function yazdir() {
//   console.log("Merhaba");
// }
// yazdir();

// const yazdir = () => {
//   console.log("Selam");
// };

// yazdir();

// const yazdir = (firstname) => {
//   console.log("Merhaba", firstname);
// };
// yazdir("İkra");

// const kupAl = (x) => {
//   return x * x * x;
// };
// console.log("Deger", kupAl(4));

// const kupAl = (x) => x * x * x;
// console.log("Deger", kupAl(4));

//Destructing Kullanımı

//let langs = ["C#", "C++", "Javascript", "Python"];
//let lang1, lang2, lang3, lang4;

// lang1 = langs[0];
// lang2 = langs[1];
// lang3 = langs[2];
// lang4 = langs[3];

//[lang1, lang2, lang3, lang4] = langs;

//console.log(lang1, lang2, lang3, lang4);

// const hesapla = (a, b) => {
//   const toplam = a + b;
//   const cikar = a - b;
//   const carp = a * b;
//   const bol = a / b;

//   const dizi = [toplam, cikar, carp, bol];
//   return dizi;
// };

// let [a, b, c, d] = hesapla(10, x"2);

// console.log(a, b, c, d);

// const person = {
//   firstName: "İkra",
//   lastName: "Sezgek",
//   salary: 5000,
//   age: 21,
// };

// let { firstName, lastName, salary, age } = person;
// console.log(firstName, lastName, salary, age);

//SPREAD OPERATÖRÜ

// let numbers = [10, 20, 30, 40];
// function add(a, b, c, d) {
//   console.log(a + b + c + d);
// }

//Eski Yöntem
//add(numbers[0], numbers[1], numbers[2], numbers[3]);

//Yeni Yöntem
//add(...numbers);
/* 
...numbers  ---numbers[0],numbers[1],numbers[2],numbers[3]
*/

//const diller1 = ["Java", "C#"];
//const diller2 = ["Php", "Python", diller1[0], diller1[1]];
//const diller2 = ["Php", "Python", ...diller1];

//console.log(diller2);

// const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// let [a, b, ...kalanSayilar] = numbers;

// console.log(a, b, kalanSayilar);

// const array1 = ["Enes", "Ali", "Veli", "Mehmet"];

// const array2 = [...array1];
// console.log(array2);

//OOP

let a;

class Insan {
  /*
    1-Özellikler
    2-Yapıcı Metinler
    3-Function
    */

  constructor(isim, soyisim, yas, maas) {
    //yapıcı metot

    this.isim = isim;
    this.soyisim = soyisim;
    this.yas = yas;
    this.maas = maas;
  }

  bilgileriGoster() {
    console.log(
      `isim :${this.isim} 
         Soyisim : ${this.soyisim} 
         Yas : ${this.yas} 
         Maas : ${this.maas}`
    );
  }
}
//Nesne olusturmak
const insan1 = new Insan("İkra", "Sezgek", 21, 1000);
const insan2 = new Insan("Ali", "Gök", 23, 1500);

console.log(insan1.maas);
console.log(insan2.maas);
//insan1.bilgileriGoster();
//insan2.bilgileriGoster();
