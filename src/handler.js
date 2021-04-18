const { nanoid } = require('nanoid');
const books = require('./books');

const addbooksHandler = (request, h) => {
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

    if (name === '' || !name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (typeof pageCount !== 'number' || typeof readPage !== 'number') {
        const response = h.response({
            status: 'fail',
            message:
                'Gagal menambahkan buku. pageCount atau readPage harus Berupa Number',
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message:
                'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished: pageCount === readPage,
        reading,
        insertedAt,
        updatedAt,
    };
    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

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

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = (request, h) => {
    const {
        name: queryName,
        reading: queryReading,
        finished: queryFinished,
    } = request.query;

    if (queryName) {
        const allBooks = books
            .filter((book) => book.name.toLowerCase().includes(queryName.toLowerCase()))
            .map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            }));

        const response = h.response({
            status: 'success',
            data: {
                books: allBooks,
            },
        });
        response.code(200);
        return response;
    }

    if (queryReading) {
        let allBooks;

        if (queryReading === '0') {
            allBooks = books
                .filter((book) => book.reading === false)
                .map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                }));
        } else {
            allBooks = books
                .filter((book) => book.reading === true)
                .map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                }));
        }

        const response = h.response({
            status: 'success',
            data: {
                books: allBooks,
            },
        });
        response.code(200);
        return response;
    }

    if (queryFinished) {
        let allBooks;

        if (queryFinished === '1') {
            console.log('sini');
            allBooks = books
                .filter((book) => book.finished === true)
                .map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                }));
        } else {
            console.log('sono');
            allBooks = books
                .filter((book) => book.finished === false)
                .map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                }));
        }

        const response = h.response({
            status: 'success',
            data: {
                books: allBooks,
            },
        });
        response.code(200);
        return response;
    }

    const allBooks = books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    }));

    const response = {
        status: 'success',
        data: {
            books: allBooks,
        },
    };

    return response;
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((n) => n.id === bookId)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
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
    const { bookId } = request.params;

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

    if (name === '' || !name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if (typeof pageCount !== 'number' || typeof readPage !== 'number') {
        const response = h.response({
            status: 'fail',
            message:
                'Gagal memperbarui buku. pageCount atau readPage harus Berupa Number',
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message:
                'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });

        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    addbooksHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};
