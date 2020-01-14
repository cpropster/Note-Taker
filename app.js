const userContainer = document.querySelector("#user-info");
const notesContainer = document.querySelector("#note-info");
const notesInputContainer = document.querySelector("#note-input");

let user, notes;

const API = "https://acme-users-api-rev.herokuapp.com/api";

const fetchUser = async () => {
  const storage = window.localStorage;
  const userId = storage.getItem("userId");

  if (userId) {
    try {
      return (await axios.get(`${API}/users/detail/${userId}`)).data;
    } catch (ex) {
      storage.removeItem("userId");
      return fetchUser();
    }
  }
  user = (await axios.get(`${API}/users/random`)).data;
  storage.setItem("userId", user.id);
  return user;
};

const renderUser = () => {
  const html = `
    <h2 class="text-center">${user.fullName}</h2>
    <img src="${user.avatar}" class="rounded mx-auto d-block">
    <div class="text-center">${user.bio}</div>
    `;

  userContainer.innerHTML = html;
};

const renderNotes = () => {
  let html = notes
    .map((note) => {
      return `
      <li>
      ${note.text}
      ${note.archived}
      <button type="button" class="close" aria-label="Close">
      <span aria-hidden="true" data-id='${note.id}'>&times;</span>
    </button>
  </li>`;
    })
    .join("");

  html = `<h2>Notes (${notes.length})</h2><ul>${html}</ul>`;

  notesContainer.innerHTML = html;
};

const renderNoteInput = () => {
  return `
        <form id="noteInputForm">
        <input name='text'/>
        <button>Create Note</button>
        </form>
        `;
};

notesInputContainer.innerHTML = renderNoteInput();
const notesForm = document.querySelector("#noteInputForm");
const textInput = document.querySelector("input");

notesContainer.addEventListener("click", async (event) => {
  const id = event.target.getAttribute("data-id");
  console.log(id);
  if (id) {
    await axios.delete(`${API}/users/${user.id}/notes/${id}`);
  }
  notes = notes.filter((note) => note.id !== id);
  renderNotes();
});
console.log(notesForm);
notesForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const note = {
    text: textInput.value,
  };
  const response = await axios.post(`${API}/users/${user.id}/notes`, note);
  const created = response.data;
  notes = [...notes, created];
  renderNotes();
  textInput.value = "";
  console.log(notes);
});

const startApp = async () => {
  user = await fetchUser();
  renderUser(user);
  const response = await axios.get(`${API}/users/${user.id}/notes`);
  notes = response.data;
  renderNotes(notes);
};

startApp();
