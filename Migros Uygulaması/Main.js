let mesaj = `
Migros'a Hoşgeldiniz
Money Kartınız var mı ?
1-Evet
2-Hayır
`;

//335
const urunler = [
  {
    urunIsmi: "Süt",
    fiyat: 15,
  },
  {
    urunIsmi: "Bebek Bezi",
    fiyat: 100,
  },
  {
    urunIsmi: "Kuşbaşı",
    fiyat: 220,
  },
];

//True veya False
let sonuc = confirm(mesaj);
let odenecekTutar;

if (sonuc) {
  //Money kartı vardır.
  let isim = prompt("Adınızı Giriniz :");
  let soyisim = prompt("Soyisminizi Giriniz");

  const musteri = new Musteri(isim, soyisim, sonuc, urunler);

  odenecekTutar = musteri.hesapla();

  alert(
    `Müşteri Bilgileri :${musteri.isim} ${musteri.soyisim}
    Ödenecek Tutar : ${odenecekTutar} 
    `
  );
} else {
  const musteri = new Musteri(null, null, sonuc, urunler);
  odenecekTutar = musteri.hesapla();
  alert(`Ödenecek Tutar :${odenecekTutar}`);
}
