// Global değişkenler
let allUsers = [];
let userNotes = {};
let currentPage = 1;
const usersPerPage = 6;
let selectedFiles = [];
let currentFirmId = null;
let favoriModuAcik = false;
let isCitySortedAsc = true; // Sıralama durumu

// Tablo ve sayfalama fonksiyonları
function renderTableWithPagination(users = allUsers) {
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = users.slice(startIndex, endIndex);
  populateTable(currentUsers);
  displayPagination(users);
}

function populateTable(users) {
  const tableBody = document.querySelector("#userTable tbody");
  tableBody.innerHTML = "";

  if (users.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML =
      '<td colspan="7" style="text-align: center;">Hiç kullanıcı bulunamadı.</td>';
    tableBody.appendChild(row);
    return;
  }

  const starredUsers = getStarredUsers();

  users.forEach((user) => {
    const isStarred = starredUsers.includes(user.id);
    const starClass = isStarred ? "active" : "";
    const starSymbol = isStarred ? "&#9733;" : "&#9734;";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <span style="display: flex; align-items: center; gap: 8px;">
          <span class="star ${starClass}" onclick="toggleStar(this, ${
      user.id
    })">${starSymbol}</span>
          <span>${user.company.name}</span>
        </span>
      </td>
      <td>${user.website || "-"}</td>
      <td>${user.phone || "-"}</td>
      <td>${user.email}</td>
      <td>${user.address.city}</td>
      <td class="action-cell" style="justify-content: center; width:200px;">
        <button class="action-btn edit-btn" onclick="editUser(${
          user.id
        })">✏</button>
        <button class="action-btn delete-btn" onclick="deleteUser(${
          user.id
        })">🗑</button>
        <button class="action-btn noteText-btn" onclick="openNoteModal(${
          user.id
        })">📝</button>
        <button class="action-btn excel-btn" onclick="openFileModal(${
          user.id
        })">🗂️</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function displayPagination(users = allUsers) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(users.length / usersPerPage);
  const wrapper = document.createElement("div");
  wrapper.classList.add("pagination-wrapper");

  // Önceki Butonu
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Önceki";
  prevBtn.className = "btn btn-secondary";
  if (currentPage === 1) {
    prevBtn.disabled = true;
    prevBtn.style.opacity = "0.5";
    prevBtn.style.cursor = "default";
  }
  prevBtn.addEventListener("click", () => {
    if (currentPage !== 1) {
      currentPage--;
      renderTableWithPagination(users);
    }
  });

  // Sayfa Numaraları
  const pageNumbersWrapper = document.createElement("div");
  pageNumbersWrapper.classList.add("page-numbers-wrapper");

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    pageBtn.className = `pagination-btn${
      i === currentPage ? " active-page" : ""
    }`;
    pageBtn.style.margin = "0 5px";
    pageBtn.addEventListener("click", () => {
      currentPage = i;
      renderTableWithPagination(users);
    });
    pageNumbersWrapper.appendChild(pageBtn);
  }

  // Sonraki Butonu
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Sonraki";
  nextBtn.className = "btn btn-secondary";
  if (currentPage === totalPages) {
    nextBtn.disabled = true;
    nextBtn.style.opacity = "0.5";
    nextBtn.style.cursor = "default";
  }
  nextBtn.addEventListener("click", () => {
    if (currentPage !== totalPages) {
      currentPage++;
      renderTableWithPagination(users);
    }
  });

  wrapper.appendChild(prevBtn);
  wrapper.appendChild(pageNumbersWrapper);
  wrapper.appendChild(nextBtn);
  paginationContainer.appendChild(wrapper);
}

// Dosya işlemleri
function openFileModal(userId) {
  currentFirmId = userId;
  selectedFiles = [];
  $("#fileModal").modal("show");
  fetchAndRenderFiles();

  setTimeout(() => {
    const fileSelectBtn = document.querySelector(".file-select-btn");
    const fileInput = document.getElementById("fileInput");
    const dropZone = document.getElementById("dropZone");

    if (fileSelectBtn && fileInput) {
      fileSelectBtn.onclick = () => fileInput.click();
    }

    if (fileInput) {
      fileInput.onchange = (e) => handleFiles(e.target.files);
    }

    if (dropZone) {
      dropZone.ondragover = (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "#6dd5fa";
        dropZone.style.background = "#f0f7ff";
      };
      dropZone.ondragleave = (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "#2986e2";
        dropZone.style.background = "#f8f9fa";
      };
      dropZone.ondrop = (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "#2986e2";
        dropZone.style.background = "#f8f9fa";
        handleFiles(e.dataTransfer.files);
      };
    }
  }, 100);
}

function handleFiles(files) {
  if (!files.length) return;
  Array.from(files).forEach(uploadFile);
}

function uploadFile(file) {
  const formData = new FormData();

  // Dosya adını düzenleme
  let newFileName = file.name;
  if (newFileName.match(/Ekran g[^]+?\d{6,8}\.png$/)) {
    const date = new Date();
    const timestamp = date.toISOString().split("T")[0];
    newFileName = `Ekran_Goruntusu_${timestamp}.png`;
  }

  // Yeni isimle dosyayı FormData'ya ekle
  const newFile = new File([file], newFileName, { type: file.type });
  formData.append("file", newFile);

  fetch(`http://localhost:3000/users/${currentFirmId}/upload`, {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      if (!res.ok) throw new Error("Yükleme başarısız");
      return res.json();
    })
    .then(() => {
      fetchAndRenderFiles();
      Swal.fire("Başarılı!", "Dosya başarıyla yüklendi.", "success");
    })
    .catch((err) => {
      Swal.fire("Hata", "Dosya yüklenemedi: " + err.message, "error");
    });
}

function fetchAndRenderFiles() {
  fetch(`http://localhost:3000/users/${currentFirmId}/files`)
    .then((res) => res.json())
    .then((files) => {
      renderFileList(files);
    });
}

function renderFileList(files) {
  const fileList = document.getElementById("fileList");
  if (!files.length) {
    fileList.innerHTML =
      '<div class="text-muted">Henüz dosya eklenmemiş.</div>';
    return;
  }
  fileList.innerHTML = files
    .map((file) => {
      // Dosya adını düzenleme
      const fileName = decodeURIComponent(file.fileName)
        .replace(/Ekran g[^]+?\d{6}\.png$/, "Ekran Görüntüsü.png")
        .replace(/Ekran g[^]+?\d{8}\.png$/, "Ekran Görüntüsü.png");

      return `
          <div class="file-details" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;padding:10px;border-radius:8px;background-color:#f0f7ff;border:1px solid #2986e2;">
            <span style="display:flex;align-items:center;gap:8px;">
              <i class="fas fa-file" style="color:#2986e2;font-size:16px;"></i>
              <span style="font-size:14px;color:#2c3e50;font-weight:500;">${fileName}</span>
            </span>
            <span style="display:flex;gap:10px;">
              <button class="btn" onclick="downloadFile(${file.id})" 
                style="padding:4px 6px;background-color:#2986e2;color:white;border:none;border-radius:6px;display:flex;align-items:center;gap:6px;transition:all 0.2s ease;box-shadow:0 2px 4px rgba(41,134,226,0.2);">
                <i class="fas fa-download" style="color:white;"></i>
                <span style="color:white;">İndir</span>
              </button>
              <button class="btn" onclick="deleteFile(${file.id})"
                style="padding:4px 6px;background-color:#ffffff;color:#2986e2;border:1px solidrgb(231, 48, 48);border-radius:6px;display:flex;align-items:center;gap:6px;transition:all 0.2s ease;">
                <i class="fas fa-trash" style="color:#dc3545;"></i>
                <span style="color:#dc3545;">Sil</span>
              </button>
            </span>
          </div>
        `;
    })
    .join("");

  // Hover efektleri için stil ekle
  const style = document.createElement("style");
  style.textContent = `
    .file-details {
      transition: all 0.2s ease;
    }
    .file-details:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(41,134,226,0.1);
    }
    .file-details button:first-of-type:hover {
      background-color: #2476cc;
    }
    .file-details button:first-of-type:hover i,
    .file-details button:first-of-type:hover span {
      color: white;
    }
    .file-details button:last-of-type:hover {
      background-color: #ffefef;
      color: #dc3545;
      border-color: #dc3545;
    }
    .file-details button:last-of-type:hover i,
    .file-details button:last-of-type:hover span {
      color: #dc3545;
    }
    .file-details button:active {
      transform: translateY(1px);
    }
  `;
  document.head.appendChild(style);
}

function downloadFile(fileId) {
  window.open(`http://localhost:3000/files/${fileId}`, "_blank");
}

function deleteFile(fileId) {
  Swal.fire({
    title: "Emin misiniz?",
    text: "Bu dosyayı silmek istediğinize emin misiniz?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Evet, sil!",
    cancelButtonText: "İptal",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:3000/files/${fileId}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() => {
          fetchAndRenderFiles();
          Swal.fire("Silindi!", "Dosya başarıyla silindi.", "success");
        });
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  currentPage = parseInt(localStorage.getItem("currentPage")) || 1;

  // FAVORİ MODUNU LOCALSTORAGE'DAN AL
  const favoriModu = localStorage.getItem("favoriModu") === "true";

  getData("http://localhost:3000/users", favoriModu);

  const btn = document.getElementById("favoriToggleBtn");

  // BUTON METNİNİ DOĞRU GÖSTER
  btn.textContent = favoriModu ? "Tümünü Göster 🔄" : "Favorileri Göster ⭐";

  btn.addEventListener("click", () => {
    const favoriModu = btn.textContent === "Favorileri Göster ⭐";
    localStorage.setItem("favoriModu", favoriModu); // GÜNCELLE

    btn.textContent = favoriModu ? "Tümünü Göster 🔄" : "Favorileri Göster ⭐";

    currentPage = 1;
    if (favoriModu) {
      const starredIds = getStarredUsers();
      const favoriler = allUsers.filter((user) => starredIds.includes(user.id));
      renderTableWithPagination(favoriler);
    } else {
      renderTableWithPagination(allUsers);
    }
  });
});

// Veri çekme fonksiyonu
function getData(url, favoriModu) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      allUsers = data;

      // Kullanıcıları ID'ye göre azalan sırada sırala
      allUsers.sort((a, b) => b.id - a.id);

      // Sayfa yenilendiğinde favori moda göre tabloyu getir
      if (favoriModu) {
        const starredIds = getStarredUsers();
        const favoriler = allUsers.filter((user) =>
          starredIds.includes(user.id)
        );
        renderTableWithPagination(favoriler);
      } else {
        renderTableWithPagination(allUsers);
      }
    })
    .catch((err) => console.log(err));
}

// Firma Ekle
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("kisiekle").addEventListener("click", () => {
    document.getElementById("newCompany").value = "";
    document.getElementById("newWebsite").value = "";
    document.getElementById("newPhone").value = "";
    document.getElementById("newEmail").value = "";
    document.getElementById("newCity").value = "";

    $("#addCompanyModal").modal("show");
  });

  document
    .getElementById("saveNewCompanyBtn")
    .addEventListener("click", async () => {
      const company = document.getElementById("newCompany").value;
      const website = document.getElementById("newWebsite").value;
      const phone = document.getElementById("newPhone").value;
      const email = document.getElementById("newEmail").value;
      const city = document.getElementById("newCity").value;

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

      const newUser = {
        company: { name: company },
        website,
        phone,
        email,
        address: { city },
      };

      try {
        const response = await fetch("http://localhost:3000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        });

        if (!response.ok) {
          throw new Error("Firma eklenemedi.");
        }

        const createdUser = await response.json();
        allUsers.unshift(createdUser); // Yeni kullanıcıyı dizinin başına ekle
        currentPage = 1; // Sayfayı ilk sayfaya döndür
        renderTableWithPagination(); // Tabloyu güncelle

        $("#addCompanyModal").modal("hide");

        await Swal.fire({
          icon: "success",
          title: "Başarılı!",
          text: "Firma başarıyla eklendi.",
          confirmButtonText: "Tamam",
        });
      } catch (error) {
        console.error("Hata:", error);
        await Swal.fire({
          icon: "error",
          title: "Hata!",
          text: "Kullanıcı eklenirken bir hata oluştu.",
          confirmButtonText: "Tamam",
        });
      }
    });

  // Excel yükleme butonu için event listener
  const excelFileInput = document.createElement("input");
  excelFileInput.type = "file";
  excelFileInput.accept = ".xlsx, .xls";
  excelFileInput.style.display = "none";
  excelFileInput.addEventListener("change", handleFileSelect);
  document.body.appendChild(excelFileInput);

  // Excel yükleme butonu
  const excelButton = document.createElement("button");
  excelButton.className = "btn btn-success";
  excelButton.innerHTML = "Excel'den Veri Yükle";
  excelButton.onclick = () => excelFileInput.click();

  // Butonu sayfaya ekle (örnek olarak arama kutusunun yanına)
  const searchContainer = document.querySelector(".search-container");
  if (searchContainer) {
    searchContainer.appendChild(excelButton);
  }

  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("fileInput");
  const fileInfo = document.getElementById("fileInfo");
  const selectedFileName = document.getElementById("selectedFileName");
  const downloadLink = document.getElementById("downloadLink");
  const removeFile = document.getElementById("removeFile");

  // Arama fonksiyonu
  document
    .getElementById("searchInput")
    .addEventListener("input", function (e) {
      const searchText = e.target.value.toLowerCase();
      const filteredUsers = allUsers.filter((user) => {
        return (
          user.company.name.toLowerCase().includes(searchText) ||
          (user.website && user.website.toLowerCase().includes(searchText)) ||
          (user.phone && user.phone.toLowerCase().includes(searchText)) ||
          user.email.toLowerCase().includes(searchText) ||
          user.address.city.toLowerCase().includes(searchText)
        );
      });

      currentPage = 1;
      renderTableWithPagination(filteredUsers);
    });
});

//yıldızı kaydetme
function getStarredUsers() {
  const data = localStorage.getItem("starredUsers");
  return data ? JSON.parse(data) : [];
}

function saveStarredUsers(data) {
  localStorage.setItem("starredUsers", JSON.stringify(data));
}

function toggleStar(element, userId) {
  let starred = getStarredUsers();

  if (starred.includes(userId)) {
    starred = starred.filter((id) => id !== userId);
    element.classList.remove("active");
    element.innerHTML = "&#9734;";
  } else {
    starred.push(userId);
    element.classList.add("active");
    element.innerHTML = "&#9733;";
  }

  saveStarredUsers(starred);
  renderTableWithPagination();
}

// Kullanıcı düzenleme
let selectedUserId = null;

function editUser(userId) {
  selectedUserId = userId;
  const user = allUsers.find((u) => u.id === userId);
  if (user) {
    document.getElementById("company").value = user.company.name;
    document.getElementById("website").value = user.website || "";
    document.getElementById("phone").value = user.phone || "";
    document.getElementById("email").value = user.email;
    document.getElementById("city").value = user.address.city;
    $("#editUserModal").modal("show");
  }
}

// Save button event listener for editing user
document.getElementById("saveUserBtn").addEventListener("click", async () => {
  const company = document.getElementById("company").value;
  const website = document.getElementById("website").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const city = document.getElementById("city").value;

  // Email validation
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

  // Update user object
  const updatedUser = {
    id: selectedUserId,
    company: { name: company },
    website,
    phone,
    email,
    address: { city },
  };

  try {
    // Send update request to backend
    const response = await fetch("http://localhost:3000/api/editUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    });

    if (!response.ok) {
      throw new Error("Güncelleme başarısız oldu");
    }

    // Get updated data from backend
    await getData("http://localhost:3000/users");

    $("#editUserModal").modal("hide");

    await Swal.fire({
      icon: "success",
      title: "Güncelleme Başarılı",
      text: "Kullanıcı bilgileri başarıyla güncellendi.",
      confirmButtonText: "Tamam",
    }).then(() => {
      // Düzenleme işlemi başarılı olduktan sonra sayfayı yenile
      currentPage = 1; // İlk sayfaya dön
      window.location.reload(); // Sayfayı yenile
    });
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    await Swal.fire({
      icon: "error",
      title: "Hata!",
      text: "Kullanıcı güncellenirken bir hata oluştu.",
      confirmButtonText: "Tamam",
    });
  }
});

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
      // Backend'e silme isteği gönder
      fetch(`http://localhost:3000/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Silme işlemi başarısız oldu");
          }
          return response.json();
        })
        .then(() => {
          // Backend'den güncel listeyi al
          getData("http://localhost:3000/users");

          Swal.fire({
            title: "Silindi!",
            text: "Kullanıcı başarıyla silindi.",
            icon: "success",
          }).then(() => {
            // Silme işlemi başarılı olduktan sonra sayfayı yenile
            currentPage = 1; // İlk sayfaya dön
            window.location.reload(); // Sayfayı yenile
          });
        })
        .catch((error) => {
          console.error("Silme hatası:", error);
          Swal.fire({
            title: "Hata!",
            text: "Kullanıcı silinirken bir hata oluştu.",
            icon: "error",
          });
        });
    }
  });
}
//not
let currentUserId = null;
let editingNoteIndex = null;

function openNoteModal(userId) {
  currentUserId = userId;
  renderNotes();
  hideNoteInput();
  $("#noteModal").modal("show");
}

function renderNotes() {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  const userNotes = notes.filter((n) => n.id === currentUserId);
  const allNotesArea = document.getElementById("allNotesArea");

  if (userNotes.length > 0) {
    allNotesArea.innerHTML = userNotes
      .map(
        (note, idx) => `
        <div class="note-box" id="note-${idx}">
          <div class="note-header">
            <span class="note-date">${note.timestamp || "Tarih yok"}</span>
            <span class="note-actions">
              <button title="Düzenle" onclick="editNote(${idx}, '${
          note.note
        }')">✏</button>
              <button title="Sil" onclick="deleteNote(${idx})">❌</button>
            </span>
          </div>
          <div class="note-content" id="note-content-${idx}">${note.note}</div>
        </div>
      `
      )
      .join("");
  } else {
    allNotesArea.innerHTML =
      '<div class="text-muted">Henüz not eklenmemiş.</div>';
  }
}

function showNoteInput() {
  document.getElementById("noteInputArea").style.display = "block";
  document.getElementById("noteText").value = "";
  editingNoteIndex = null;
}

function hideNoteInput() {
  document.getElementById("noteInputArea").style.display = "none";
  editingNoteIndex = null;
}

function saveNote() {
  const note = document.getElementById("noteText").value;
  if (note.trim() !== "") {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    if (editingNoteIndex !== null) {
      const userNotes = notes.filter((n) => n.id === currentUserId);
      const globalIndex = notes.findIndex(
        (n, i) =>
          n.id === currentUserId && userNotes.indexOf(n) === editingNoteIndex
      );
      if (globalIndex !== -1) {
        notes[globalIndex].note = note;
        notes[globalIndex].timestamp = formattedDate;
      }
    } else {
      notes.push({
        id: currentUserId,
        note: note,
        timestamp: formattedDate,
      });
    }

    localStorage.setItem("notes", JSON.stringify(notes));
    hideNoteInput();
    renderNotes();
  }
}

function editNote(idx, noteText) {
  const noteContent = document.getElementById(`note-content-${idx}`);
  const originalText = noteText;

  // Not içeriğini düzenlenebilir textarea ile değiştir
  noteContent.innerHTML = `
    <textarea class="form-control edit-note-textarea">${originalText}</textarea>
    <div class="note-edit-actions">
      <button class="btn btn-success btn-sm" onclick="saveEditedNote(${idx})">Kaydet</button>
      <button class="btn btn-secondary btn-sm" onclick="cancelEdit(${idx}, '${originalText}')">İptal</button>
    </div>
  `;
}

function saveEditedNote(idx) {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  const noteTextarea = document.querySelector(`#note-content-${idx} textarea`);
  const newText = noteTextarea.value;

  // Notu güncelle
  const noteIndex = notes.findIndex((n) => n.id === currentUserId);
  if (noteIndex !== -1) {
    notes[noteIndex].note = newText;
    notes[noteIndex].timestamp = new Date().toLocaleString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    localStorage.setItem("notes", JSON.stringify(notes));
  }

  renderNotes();
}

function cancelEdit(idx, originalText) {
  const noteContent = document.getElementById(`note-content-${idx}`);
  noteContent.innerHTML = originalText;
}

function deleteNote(idx) {
  Swal.fire({
    title: "Emin misiniz?",
    text: "Bu notu silmek istediğinize emin misiniz?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Evet, sil!",
    cancelButtonText: "İptal",
  }).then((result) => {
    if (result.isConfirmed) {
      let notes = JSON.parse(localStorage.getItem("notes")) || [];
      let userNotes = notes.filter((n) => n.id === currentUserId);
      const noteToDelete = userNotes[idx];

      notes = notes.filter(
        (n) =>
          !(
            n.id === currentUserId &&
            n.timestamp === noteToDelete.timestamp &&
            n.note === noteToDelete.note
          )
      );

      localStorage.setItem("notes", JSON.stringify(notes));
      renderNotes();

      Swal.fire("Silindi!", "Not başarıyla silindi.", "success");
    }
  });
}

// Excel dosyasını okuma fonksiyonu
function handleFileSelect(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    // İlk sayfayı al
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

    // JSON'a dönüştür
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);

    // Verileri dönüştür ve allUsers'a ekle
    allUsers = jsonData.map((row) => ({
      name: row["İsim"] || row["Name"] || "",
      username: row["Kullanıcı Adı"] || row["Username"] || "",
      email: row["E-posta"] || row["Email"] || "",
      address: {
        city: row["Şehir"] || row["City"] || "",
      },
      company: {
        name: row["Firma"] || row["Company"] || "",
      },
    }));

    // Tabloyu güncelle
    renderTableWithPagination();
  };

  reader.readAsArrayBuffer(file);
}

$(document).ready(function () {
  // Dosya yükleme
  $("#uploadFileBtn").on("click", function () {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "/"; // Tüm dosya türlerine izin verir
    fileInput.onchange = async (e) => {
      const files = e.target.files;
      if (!files.length) return;

      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files[]", files[i]); // 'files[]' backend'de beklenen isim
      }

      try {
        const response = await fetch(
          `http://localhost:3000/users/${window.selectedActionUserId}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) throw new Error("Yükleme başarısız.");

        alert("Dosya başarıyla yüklendi!");
        $("#actionModal").modal("hide");
      } catch (err) {
        alert("Yükleme sırasında bir hata oluştu: " + err.message);
      }
    };
    fileInput.click();
  });

  // PDF dışa aktar
  $("#exportPdfBtn").click(function () {
    // Geçici bir tablo oluştur
    const table = document.createElement("table");
    table.className = "table table-bordered";

    // Stil ekle
    const style = document.createElement("style");
    style.textContent = `
      .star.active {
        color: #FFD700 !important; /* Altın sarısı */
        font-size: 16px;
      }
      .star {
        color: #C0C0C0;
        font-size: 16px;
      }
    `;
    document.head.appendChild(style);

    // Başlık satırı
    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr style="background-color: #2986e2; color: white;">
        <th>Firma Adı</th>
        <th>Web Sitesi</th>
        <th>İletişim</th>
        <th>E-posta</th>
        <th>Şehir</th>
      </tr>
    `;
    table.appendChild(thead);

    // Tablo gövdesi
    const tbody = document.createElement("tbody");

    // Use allUsers instead of just the visible rows
    allUsers.forEach((user) => {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td>${user.company.name}</td>
        <td>${user.website || "-"}</td>
        <td>${user.phone || "-"}</td>
        <td>${user.email}</td>
        <td>${user.address.city}</td>
      `;
      tbody.appendChild(newRow);
    });

    table.appendChild(tbody);

    // Stil elementini temizle
    setTimeout(() => {
      document.head.removeChild(style);
    }, 1000);

    const opt = {
      margin: 10,
      filename: "tablo.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        letterRendering: true,
        useCORS: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "landscape",
        compress: true,
      },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    // PDF oluştur
    html2pdf()
      .set(opt)
      .from(table)
      .save()
      .catch((err) => {
        console.error("PDF oluşturma hatası:", err);
        Swal.fire({
          icon: "error",
          title: "Hata!",
          text: "PDF oluşturulurken bir hata oluştu.",
        });
      });
  });

  // Excel dışa aktar
  $("#exportExcelBtn").on("click", function () {
    // Başlıklar
    const headers = ["Firma Adı", "Web Sitesi", "İletişim", "E-posta", "Şehir"];
    const data = [headers];

    allUsers.forEach((user) => {
      const rowData = [
        user.company.name,
        user.website || "-",
        user.phone || "-",
        user.email,
        user.address.city,
      ];
      data.push(rowData);
    });

    // SheetJS ile XLSX dosyası oluştur
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Sütun genişliklerini ayarla
    const columnWidths = [
      { wch: 25 }, // Firma Adı
      { wch: 30 }, // Web Sitesi
      { wch: 20 }, // İletişim
      { wch: 30 }, // E-posta
      { wch: 20 }, // Şehir
    ];
    ws["!cols"] = columnWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Kullanıcılar");
    XLSX.writeFile(wb, "kullanici_tablosu.xlsx");
  });
});

// Sayfa numarasını güncelle
function updatePage(page) {
  currentPage = page;
  localStorage.setItem("currentPage", currentPage); // Sayfa numarasını depola
}

function sortCities() {
  // Butona tıklandığında bir sınıf ekle
  const cityHeader = document.getElementById("cityHeader");
  cityHeader.classList.add("active");

  // Şehirleri sıralama
  allUsers.sort((a, b) => {
    const cityA = a.address.city.toLowerCase();
    const cityB = b.address.city.toLowerCase();
    if (cityA < cityB) return isCitySortedAsc ? -1 : 1;
    if (cityA > cityB) return isCitySortedAsc ? 1 : -1;
    return 0;
  });

  // Sıralama durumunu değiştir
  isCitySortedAsc = !isCitySortedAsc;

  // Tabloyu yeniden render et
  renderTableWithPagination(allUsers);

  // Sınıfı kaldır (bir süre sonra)
  setTimeout(() => {
    cityHeader.classList.remove("active");
  }, 200); // 200 ms sonra sınıfı kaldır
}
