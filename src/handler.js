const {nanoid} = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Name is undefined
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // Read page value is larger than page count
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh ' +
      'lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage,
    finished, reading, insertedAt, updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  // Success
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
};

const getAllBooksHandler = (request, h) => {
  const {name, reading, finished} = request.query;
  const isUseQuery = name !== undefined ||
  reading !== undefined || finished !== undefined;

  let filteredBooks = books;

  if (isUseQuery) {
    const isUseQueryName = name !== undefined;
    const isUseQueryReading = reading !== undefined;
    const isUseQueryFinished = finished !== undefined;

    filteredBooks = books.filter((book) => {
      // Query name
      if (isUseQueryName &&
        !book.name.toLowerCase().includes(name.toLowerCase())) {
        return false;
      }
      // Query reading
      if (isUseQueryReading) {
        if (reading == 1 && !book.reading) {
          return false;
        } else if (reading == 0 && book.reading) {
          return false;
        }
      }
      // Query finished
      if (isUseQueryFinished) {
        if (finished == 1 && !book.finished) {
          return false;
        } else if (finished == 0 && book.finished) {
          return false;
        }
      }
      return true;
    });
  }

  const booksMapped = filteredBooks.map((book) => {
    return {
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    };
  });

  const response = h.response({
    status: 'success',
    data: {
      books: booksMapped,
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const {id} = request.params;
  const book = books.filter((book) => book.id === id)[0];

  // Book not found
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book: book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const {id} = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Name is undefined
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // Read page value is larger than page count
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh ' +
      'lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);
  const finished = pageCount === readPage;

  // ID not found
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  // Success
  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    updatedAt,
  };
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const {id} = request.params;
  const index = books.findIndex((book) => book.id === id);

  // ID not found
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  books.splice(id, 1);
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  response.code(200);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
