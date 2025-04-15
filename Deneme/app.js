let allUsers = [];

function populateTable(users) {
  const tableBody = document.querySelector("#userTable tbody");
  tableBody.innerHTML = ""; // önceden eklenmiş satırlar varsa temizle.

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
  <td>${user.name}</td>
  <td>${user.username}</td>
  <td>${user.email}</td>
  <td>${user.address.city}</td>
  <td>${user.company.name}</td>
  <td class="action-cell">
    <button class="action-btn edit-btn" onclick="editUser(${user.id})">Düzenle</button>
    <button class="action-btn delete-btn" onclick="deleteUser(${user.id})">Sil</button>
  </td>
`;

    tableBody.appendChild(row);
  });
}
function getData(url) {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      allUsers = data;
      renderTableWithPagination(); // ← Bunu buraya yazıyorsun
    })
    .catch((err) => console.log(err));
}

//Kullanıcı düzenleme

let selectedUserId = null;

function editUser(userId) {
  const user = allUsers.find((u) => u.id === userId);
  selectedUserId = userId;

  document.getElementById("name").value = user.name;
  document.getElementById("username").value = user.username;
  document.getElementById("email").value = user.email;
  document.getElementById("city").value = user.address.city;
  document.getElementById("company").value = user.company.name;

  const saveBtn = document.getElementById("saveUserBtn");
  saveBtn.replaceWith(saveBtn.cloneNode(true));

  document.getElementById("saveUserBtn").addEventListener("click", async () => {
    const name = document.getElementById("name").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const city = document.getElementById("city").value;
    const company = document.getElementById("company").value;

    // Mail kısmını düzenleme
    //Geçersiz Email girilirse.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      await Swal.fire({
        icon: "error",
        title: "Geçersiz E-posta",
        text: "Lütfen geçerli bir e-posta adresi girin.",
        confirmButtonText: "Tamam",
      });
      return;
    }

    // Geçerli Email
    const user = allUsers.find((u) => u.id === selectedUserId);
    user.name = name;
    user.username = username;
    user.email = email;
    user.address.city = city;
    user.company.name = company;

    populateTable(allUsers);
    $("#editUserModal").modal("hide");

    await Swal.fire({
      icon: "success",
      title: "Güncelleme Başarılı",
      text: "Kullanıcı bilgileri başarıyla güncellendi.",
      confirmButtonText: "Tamam",
    });
  });

  $("#editUserModal").modal("show");
}

//Kullanıcıyı silme
function deleteUser(userId) {
  Swal.fire({
    title: "Emin misiniz?",
    text: "Bu kullanıcıyı sildikten sonra geri alamazsınız!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Evet, sil!",
    cancelButtonText: "İptal",
  }).then((result) => {
    if (result.isConfirmed) {
      allUsers = allUsers.filter((user) => user.id !== userId); // Kullanıcıyı diziden çıkar
      populateTable(allUsers); // Tabloyu güncelle
      Swal.fire({
        title: "Silindi!",
        text: "Kullanıcı başarıyla silindi.",
        icon: "success",
      });
    }
  });
}

document.getElementById("searchInput").addEventListener("input", function (e) {
  const searchText = e.target.value.toLowerCase();

  const filteredUsers = allUsers.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchText) ||
      user.username.toLowerCase().includes(searchText) ||
      user.address.city.toLowerCase().includes(searchText) ||
      user.company.name.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText)
    );
  });

  populateTable(filteredUsers); // filtrelenmiş kullanıcıları tabloya yazdırıyorum.
});

document.getElementById("saveUserBtn").addEventListener("click", () => {
  const user = allUsers.find((u) => u.id === selectedUserId);

  user.name = document.getElementById("name").value;
  user.username = document.getElementById("username").value;
  user.email = document.getElementById("email").value;
  user.address.city = document.getElementById("city").value;
  user.company.name = document.getElementById("company").value;

  populateTable(allUsers);
  $("#editUserModal").modal("hide");
});

let currentPage = 1;
const usersPerPage = 5;

function displayPagination(totalUsers) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(totalUsers.length / usersPerPage);

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Önceki";
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTableWithPagination();
    }
  });

  paginationContainer.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    if (i === currentPage) pageBtn.classList.add("active-page");

    pageBtn.addEventListener("click", () => {
      currentPage = i;
      renderTableWithPagination();
    });

    paginationContainer.appendChild(pageBtn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Sonraki";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderTableWithPagination();
    }
  });

  paginationContainer.appendChild(nextBtn);
}

function renderTableWithPagination() {
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = allUsers.slice(startIndex, endIndex);

  populateTable(currentUsers);
  displayPagination(allUsers);
}

getData("https://jsonplaceholder.typicode.com/users");
