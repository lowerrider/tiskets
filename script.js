import tickets from "./tickets.json" assert { type: "json" };

const filesButton = document.querySelector(".files-btn");
const files = document.querySelector(".files");

function setFiles() {
  tickets.forEach((el) => {
    const file = document.createElement("div");
    file.textContent = el;
    files.append(file);
  });
}

filesButton.addEventListener("click", setFiles);

class FilesApi {
  folders = new Map();

  constructor(tickets) {
    this.tickets = tickets;
    this.createFolders();
  }
  createFolders() {
    this.tickets.forEach((el) => {
      const [title, month, format] = el.split(/[_.]+/);

      if (!this.folders.has(month)) {
        const set = new Set();
        this.folders.set(month, set);
      }
    });
  }
  addFilesToFolders(el) {
    if (!this.folders.size) return;

    this.folders.forEach((set, month) => {
      const ticketName = `${el.title}_${month}.${el.format}`;
      if (month == el.month) {
        if (set.has(ticketName)) {
          set.delete(ticketName);
        }
        set.add(el);
      } else {
        const isCurrentTicket = Array.from(set).find((e) => typeof e === "object" && e.title == el.title);
        if (isCurrentTicket) {
          set.delete(ticketName);
        } else {
          set.add(ticketName);
        }
      }
    });
  }

  get getFolder() {
    return this.folders;
  }

  renderMonthFolderFiles() {}
}

const f = new FilesApi(tickets);

tickets.forEach((el) => {
  const [title, month, format] = el.split(/[_.]+/);
  f.addFilesToFolders({
    title,
    month,
    format,
    name: el,
  });
});

console.log([...f.getFolder.get("апрель")]);
