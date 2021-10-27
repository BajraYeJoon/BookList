const form = document.querySelector("#form-book");
const list = document.querySelector("#list-book");

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById("list-book");
    const row = document.createElement("tr");
    row.innerHTML = `
             <td>${book.title}</td>
             <td>${book.author}</td>
             <td>${book.isbn}</td>
             <td><a href="#" class="delete">X</a></td>
       `;

    list.appendChild(row);
  }
  showAlert(message, className) {
    const div = document.createElement("div");

    div.className = `alert ${className}`;

    div.appendChild(document.createTextNode(message));

    const container = document.querySelector(".container");

    const form = document.querySelector("#form-book");

    container.insertBefore(div, form);

    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 2000);
  }

  deleteBook(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
  }
  clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }
}

class Storage {
  static getBook() {
    let books;
    if (localStorage.getItem("books") === null) {
       books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static displayBooks() {
    const books = Storage.getBook();

    books.forEach(function(book){
      const ui = new UI;

      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Storage.getBook();

    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(isbn) {
    const books = Storage.getBook();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books))
  }
}

//DOM LOAD EVENT
document.addEventListener("DOMContentLoaded", Storage.displayBooks);

//EVENT LISTENER FOR BOOK TO BE ADDED

form.addEventListener("submit", (e) => {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;

  //instantiate
  const book = new Book(title, author, isbn);

  //instantiate UI
  const ui = new UI();

  //validation
  if (title === "" || author === "" || isbn === " ") {
    ui.showAlert("Please Enter the required field", "error");
  } else {
    ui.addBookToList(book);

    Storage.addBook(book);

    //if book is added
    ui.showAlert("Book is added", "success");

    ui.clearFields();
  }

  e.preventDefault();
});

list.addEventListener("click", (e) => {
  const ui = new UI();

  ui.deleteBook(e.target);

  Storage.removeBook(e.target.parentElement.previousElementSibling.textContent);
  ui.showAlert("Book Removed", "error");

  e.preventDefault();
});
