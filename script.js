import tickets from "./tickets.json" assert { type: "json" };

const filesButton = document.querySelector(".files-btn");
const files = document.querySelector(".files");
const folderContainer = document.querySelector(".folders-container");
const folderButton = document.querySelector(".folder-btn");
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal-header');
const modalBodyPayed = document.querySelector('.modal-body-payed');
const modalBodyNotPayed = document.querySelector('.modal-body-notPayed');

function setFiles(e) {
  tickets.forEach((el) => {
    const file = document.createElement("div");
    file.textContent = el;
    files.append(file);
  });
  e.target.setAttribute('disabled', true)
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

  get getFolders() {
    return this.folders;
  }

  getMonthFolderFiles(month) {
    return [...this.folders.get(month)];
  }
}

const filesApi = new FilesApi(tickets);

function showFolders(e){
  for(let month of filesApi.getFolders.keys()){
    const folder = document.createElement('div');
    folder.classList.add('folder');
    folder.textContent = month;
    folderContainer.append(folder);
    folder.onclick = showFiles
  }
  tickets.forEach((el) => {
    const [title, month, format] = el.split(/[_.]+/);
    filesApi.addFilesToFolders({
      title,
      month,
      format,
      name: el,
    });
  });
  e.target.setAttribute('disabled', true);
}

function showFiles(e){
  
  const month = e.target.textContent;

  const files = filesApi.getMonthFolderFiles(month);

  const payedList = [];
  const notPayedList = [];

  files.forEach((file)=> {
    const fileNode = document.createElement('li');
    
    if(typeof file == 'string'){
      fileNode.textContent = file;
      notPayedList.push(fileNode)
    }
    else {
      fileNode.textContent = file.name;
      payedList.push(fileNode);
    }
  });

  const payedNodes = document.createElement('ul');
  payedNodes.classList.add('payed')
  payedList.forEach((node) => payedNodes.append(node));
    
  const notPayedNodes = document.createElement('ul');
  notPayedNodes.classList.add('not-payed');
  notPayedList.forEach((node) => notPayedNodes.append(node));
  
  modalBodyPayed.appendChild(payedNodes);
  modalBodyNotPayed.appendChild(notPayedNodes);
  
  modal.classList.toggle('hide');
}

function closeModal(){
  const payedNodeList = document.querySelector('.payed');
  const notPayedNodeList = document.querySelector('.not-payed');

  modal.classList.toggle('hide');

  modalBodyPayed.removeChild(payedNodeList);
  modalBodyNotPayed.removeChild(notPayedNodeList);
}

folderButton.addEventListener('click', showFolders);

modalClose.addEventListener('click', closeModal);
