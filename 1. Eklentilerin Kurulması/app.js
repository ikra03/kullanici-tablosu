// document.write("Hello World <br>");
// document.write("İkra Sezgek <br>");
// document.write(55);

// console.log("Hello World");
// console.log("ikra");
// console.log(30.5);
// console.log(false);
// console.log({ name: "ikra", surname: "Bayram" });
// console.clear();

// let not1 = 60;
// let not2 = 70;
// console.log(not1 + not2);

// let sayi1 = "5";
// let sayi2 = "2";
// console.log(sayi1 + sayi2);

// console.log("Notlarınızın Toplamı : " + (not1 + not2));

// confirm("Silmek istedğinize emin misiniz?");
// console.log("Verileriniz yedeklenmiştir.");

// let yas = Number(prompt("Yaşınız : "));
// console.log(typeof yas);
// let para = Number(prompt("Bütçeniz : "));

// if (yas > 18 && para >= 3000) {
//   alert("Ehliyet sınavına katılabilirsiniz.");
// } else {
//   alert("Ehliyet sınavına katılamazsınız.");
// }

// let vize1 = Number(prompt("Vize 1 notunuzu giriniz : "));
// let vize2 = Number(prompt("Vize 2 notunuzu giriniz : "));
// let final = Number(prompt("Final notunuzu giriniz : "));

// let ortalama = vize1 * 0.3 + vize2 * 0.3 + final * 0.4;

// if (ortalama > 50) {
//   alert("Geçtiniz.");
// } else {
//   alert("Kaldınız.");
// }
// let SecilenYol = prompt("Lütfen istediğiniz yolu seçiniz:");

// if (SecilenYol == 1) {
//   alert("Seçilen yol " + SecilenYol + ". yoldur");
// } else if (SecilenYol == 2) {
//   alert("Seçilen yol " + SecilenYol + ". yoldur");
// } else if (SecilenYol == 3) {
//   alert("Seçilen yol " + SecilenYol + ". yoldur");
// } else {
//   alert("Seçilen yol bulunmamaktadır.");
// }

// let ad = prompt("İsminizi girin.");
// let tckn = prompt("Tcnizi girin.");

// kontrolEt(ad, tckn);

// function kontrolEt(ad, tckn) {
//   if (ad != "") {
//     if (tckn.length == 11) {
//       console.log("İsim ve tckn sorunsuz girildi");
//     } else {
//       console.log("Lütfen tc nizi 11 karakter olacak şekilde giriniz!");
//     }
//   } else {
//     console.log("Lütfen isim alanını boş bırakmayınız !");
//   }
// }

// Beden Kitle Endeksi Hesaplama

// let kilo = Number(prompt("Kilonuzu Giriniz:"));
// let boy = Number(prompt("Boyunuzu Giriniz:"));

// let sonuc = kilo / (boy * 2);

// if (sonuc < 18.5) {
//   console.log("İdeal kilonun altında " + sonuc);
// } else if (sonuc >= 18.5 && sonuc <= 24.9) {
//   console.log("İdeal kiloda" + sonuc);
// } else if (sonuc >= 25 && sonuc <= 29.9) {
//   console.log("İdeal kiloda" + sonuc);
// } else if (sonuc >= 30 && sonuc <= 39.9) {
//   console.log("İdeal kilonun çok üstünde (obez)" + sonuc);
// } else if (sonuc >= 40) {
//   console.log("İdeal kilonun çok üstünde (obez)" + sonuc);
// }

//Benzin İstasyonu
// 1- Dizel  : 24.53
//2- Benzin : 22.25
//3- LPG    : 11.1

//Gelen Müşteriden Alacağımız Bilgiler:
//1- Yakıt Tipi
//2- Yüklenecek Yakıt Litresi

// let dizel = 24.53,
//   benzin = 22.25,
//   LPG = 11.1;

// const yeniSatir = "\r\n";

// const yakitMetni =
//   "1-Dizel " +
//   yeniSatir +
//   "2-Benzin" +
//   yeniSatir +
//   "3-LPG" +
//   yeniSatir +
//   "Yakıt türünüzü seçiniz";

// let yakitTipi = prompt(yakitMetni);
// let yakitLitresi = Number(prompt("Yakıt litresini giriniz."));
// let bakiye = Number(prompt("Bakiyenizi giriniz."));

// if (yakitTipi == "1") {
//   //DİZEL
//   let odenecekTutar = dizel * yakitLitresi;
//   if (odenecekTutar < bakiye) {
//     //bakiyeniz yeterli
//     bakiye = bakiye - odenecekTutar;
//     alert(
//       "Yakıt alma işlemi başarılı." + yeniSatir + "Kalan bakiye : " + bakiye
//     );
//   } else {
//     //Bakiye yeterli değil
//     alert(
//       "Bakiyeniz yeterli değildir. " +
//         yeniSatir +
//         "Ödenecek Tutar : " +
//         odenecekTutar +
//         yeniSatir +
//         "Bakiye : " +
//         bakiye +
//         yeniSatir +
//         "Eksik Tutar : " +
//         (odenecekTutar - bakiye)
//     );
//   }
// } else if (yakitTipi == "2") {
//   //BENZİN
//   let odenecekTutar = benzin * yakitLitresi;
//   if (odenecekTutar < bakiye) {
//     //bakiyeniz yeterli
//     bakiye = bakiye - odenecekTutar;
//     alert(
//       "Yakıt alma işlemi başarılı." + yeniSatir + "Kalan bakiye : " + bakiye
//     );
//   } else {
//     //Bakiye yeterli değil
//     alert(
//       "Bakiyeniz yeterli değildir. " +
//         yeniSatir +
//         "Ödenecek Tutar : " +
//         odenecekTutar +
//         yeniSatir +
//         "Bakiye : " +
//         bakiye +
//         yeniSatir +
//         "Eksik Tutar : " +
//         (odenecekTutar - bakiye)
//     );
//   }
// } else if (yakitTipi == "3") {
//   //LPG
//   let odenecekTutar = LPG * yakitLitresi;
//   if (odenecekTutar < bakiye) {
//     //bakiyeniz yeterli
//     bakiye = bakiye - odenecekTutar;
//     alert(
//       "Yakıt alma işlemi başarılı." + yeniSatir + "Kalan bakiye : " + bakiye
//     );
//   } else {
//     //Bakiye yeterli değil
//     alert(
//       "Bakiyeniz yeterli değildir. " +
//         yeniSatir +
//         "Ödenecek Tutar : " +
//         odenecekTutar +
//         yeniSatir +
//         "Bakiye : " +
//         bakiye +
//         yeniSatir +
//         "Eksik Tutar : " +
//         (odenecekTutar - bakiye)
//     );
//   }
// } else {
//   alert("Lütfen geçerli bir yakıt türü seçiniz.");
// }

//Benzin İstasyonu
// 1- Dizel  : 24.53
//2- Benzin : 22.25
//3- LPG    : 11.1

//Gelen Müşteriden Alacağımız Bilgiler:
//1- Yakıt Tipi
//2- Yüklenecek Yakıt Litresi

/*let sayac = 1;
  let toplam = 0;

  do {
    if (sayac % 2 == 1) {
      toplam += sayac;
    }
    sayac++;
  } while (sayac <= 25);
  console.log("Toplam :", toplam);
*/

/*ÇARPIM TABLOSU

for (let i = 1; i <= 10; i++) {
  for (let j = 1; j <= 10; j++) {
    console.log(i + "x" + j + "=" + i * j);
  }
  console.log("");
}
*/

/*let sayi = Number(prompt("Lütfen bir sayı giriniz :"));
let sonuc = true;
for (let i = 2; i <= Math.floor(sayi / 2); i++) {
  if (sayi % i == 0) {
    //Asal değildir
    sonuc = false;
    break;
  }
}
if (sonuc) {
  alert(sayi + " asaldır.");
} else {
  alert(sayi + " asal değildir.");
}
*/

/*let sayi = Number(prompt("Bir sayı giriniz."));
let carpim = 1;

for (let i = 1; i <= sayi; i++) {
  carpim = carpim * i;
}
alert("Sonuc : " + carpim);
*/

//let isimler = ["ikra", "Ali", "Mehmet", "Mine"];

//isimler.forEach(function (isim) {
// console.log(isim);
//});
