const db = require("../db");
const app = require("../app");

const Book = require("../models/book");
process.env.NODE_ENV = "test";

const request = require("supertest");
let book;

beforeEach(async function () {
    await db.query("DELETE FROM books");
    book = await Book.create({
        isbn: "978-3-16-148410-0",
        amazon_url: "https://www.test-url",
        author: "Test user",
        language: "English",
        pages: 111,
        publisher: "Test",
        title: "Test Book",
        year: 2020,
    });
});

describe("Test POST /books", function () {
    test("create a book", async function () {
        const res = await request(app).post("/books").send({
            isbn: "978-3-16-148412-0",
            amazon_url: "https://www.example-url",
            author: "Sumeyra",
            language: "English",
            pages: 333,
            publisher: "MIT",
            title: "Be Humble",
            year: 2021,
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.book.year).toEqual(2021);
    });

    test("send missing data for creating book", async function () {
        const res = await request(app).post("/books").send({
            publisher: "MIT",
            title: "Be Humble",
        });
        expect(res.statusCode).toBe(400);
    });
});

describe("Test GET /books", function () {
    test("get list of books", async function () {
        const res = await request(app).get("/books");
        expect(res.statusCode).toBe(200);
        expect(res.body.books.length).toBe(1);
    });
});

describe("Test GET /books/:isbn", function () {
    test("get one book", async function () {
        const res = await request(app).get(`/books/${book.isbn}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.book.title).toEqual("Test Book");
    });
});

describe("Test PUT /books/:isbn", function () {
    test("update a book", async function () {
        const res = await request(app).put(`/books/${book.isbn}`).send({
            amazon_url: "https://www.example-url",
            author: "Sumeyra",
            language: "English",
            pages: 222,
            publisher: "MIT",
            title: "Be Humble",
            year: 2022,
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.book.pages).toEqual(222);
        expect(res.body.book.language).toEqual("English");
        expect(res.body.book.year).toEqual(2022);
    });

    test("send missing data for update book", async function () {
        const res = await request(app).post("/books").send({
            title: "Test",
        });
        expect(res.statusCode).toBe(400);
    });
});

describe("Test DELETE /books/:isbn", function () {
    test("delete a book", async function () {
        const res = await request(app).delete(`/books/${book.isbn}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toEqual("Book deleted");
    });
});

afterAll(async function () {
    await db.end();
});
