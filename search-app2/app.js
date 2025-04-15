document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#form");
  const searchInput = document.querySelector("#searchInput");
  const searchButton = document.querySelector("#searchButton");
  const clearButton = document.querySelector("#clearButton");
  const imageListWrapper = document.querySelector(".imageList-Wrapper");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Formun yenilenmesini engelle
    search();
  });

  clearButton.addEventListener("click", function () {
    searchInput.value = "";
    imageListWrapper.innerHTML = "";
  });

  function search() {
    const value = searchInput.value.trim();
    if (!value) {
      alert("Lütfen bir şeyler aratın!");
      return;
    }

    fetch(`https://api.unsplash.com/search/photos?query=${value}`, {
      method: "GET",
      headers: {
        Authorization: "Client-ID aEXKjk-QUvDYD-m-IhJx6BLQYqvPn_pD8GfIR4RFY-0",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        imageListWrapper.innerHTML = ""; // Önceki resimleri temizle
        data.results.forEach((image) => {
          console.log(image.urls.small);
          addImageToUI(image.urls.small);
        });
      })
      .catch((err) => console.log("Hata:", err));
  }

  function addImageToUI(url) {
    const div = document.createElement("div");
    div.className = "card";

    const img = document.createElement("img");
    img.setAttribute("src", url);
    img.height = "400";
    img.width = "400";

    div.append(img);
    imageListWrapper.append(div);
  }
});
