const userContainer = document.querySelector("#user-info");
const notesContainer = document.querySelector("#note-info");
const notesInputContainer = document.querySelector("#note-input");
const textInput = document.querySelector("input");

notesInputContainer.addEventListener("submit", (event) => {
  event.preventDefault;
  const note = {
    text: textInput.value,
  };
  axios.post(`${API}/users/${user.id}/notes`, note);
});

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
  const user = (await axios.get(`${API}/users/random`)).data;
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
  const html = `
    <h2 class="text-center">Notes <span id="note-count">(${
      notes.length
    })</span></h2>
    ${notes
      .map((note) => {
        return `<button type="button" class="close" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button> ${note.text}<br><br>`;
      })
      .join("")}
    `;

  notesContainer.innerHTML = html;
};

// const renderNoteInput = () => {
//   const html = `
//     <form>
//     <input name='text'/>
//     <button>Create Note</button>
//     </form>
//     `;

//   notesInputContainer.innerHTML = html;
// };

const startApp = async () => {
  user = await fetchUser();
  renderUser(user);
  const response = await axios.get(`${API}/users/${user.id}/notes`);
  notes = response.data;
  renderNotes(notes);
};

startApp();
