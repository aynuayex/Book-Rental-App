const prisma = require("../config/prisma");

const handleBookUpload = async (req, res) => {
  try {
    console.log(req.body);
    const { book, author, category, quantity, price } = req.body;
    const { email } = req.user;
    const findUser = await prisma.user.findFirst({
      where: {
        email,
        books: {
          some: {
            book,
            author,
            category,
            quantity: Number(quantity),
            price: Number(price),
          },
        },
      },
      include: { books: true },
    });
    console.log({ findUser });
    if (findUser) return res.sendStatus(409);
    const user = await prisma.user.update({
      where: { email },
      data: {
        books: {
          create: {
            book,
            author,
            category,
            quantity: Number(quantity),
            price: Number(price),
          },
        },
      },
      include: { books: true },
    });
    console.log({ user });
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const handleGetAllBooks = async (req, res) => {
  try {
    const allBooks = await prisma.book.findMany({
      include: { uploadedBy: { select: { fullName: true } } },
    });
    const allBooksWithFullNames = allBooks.map((book) => ({
      ...book,
      uploadedBy: book.uploadedBy.fullName,
    }));
    console.log(allBooksWithFullNames);
    res.status(200).json({ allBooks: allBooksWithFullNames });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const handleGetAvailableBooks = async (req, res) => {
  try {
    const allBooks = await prisma.book.findMany({
      where: { approved: true },
      include: { uploadedBy: { select: { fullName: true } } },
    });
    const allBooksWithFullNames = allBooks.map((book) => ({
      ...book,
      uploadedBy: book.uploadedBy.fullName,
    }));
    console.log(allBooksWithFullNames);
    res.status(200).json({ allBooks: allBooksWithFullNames });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const handleGetAvailableBooksByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const allBooksByUserId = await prisma.book.findMany({
      where: { approved: true, uploadedById: id },
    });
    console.log(allBooksByUserId);
    res.status(200).json({ allBooks: allBooksByUserId });
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const handleGetAvailableBooksByCategory = async (req, res) => {
  try {
    const availableBooks = await prisma.book.findMany({
      where: { approved: true, rented: false },
    });
    const bookCategoryCount = availableBooks.reduce((acc, book) => {
      const category = book.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    console.log(bookCategoryCount);
    const bookCategoryArray = Object.entries(bookCategoryCount).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    console.log({ bookCategoryArray });
    res.status(200).json({ bookCategoryArray });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const handleGetAvailableBooksByCategoryUserId = async (req, res) => {
  try {
    const id = req.params.id;
    const availableBooks = await prisma.book.findMany({
      where: { approved: true, rented: false, uploadedById: id },
    });
    const bookCategoryCount = availableBooks.reduce((acc, book) => {
      const category = book.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    console.log(bookCategoryCount);
    const bookCategoryArray = Object.entries(bookCategoryCount).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    console.log({ bookCategoryArray });
    res.status(200).json({ bookCategoryArray });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const handleBookUpdate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { approved, rented } = req.body;
    console.log(req.params);
    console.log({haha: req.body});
    const book = await prisma.book.update({
      where: { id },
      data: { approved, rented },
    });
    console.log({stopped: book});
    if (approved === true && rented === true) {
      return next(); // Pass control to the next middleware
    }

    // If the condition is not met, send a response
    return res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const handleBookDetailUpdate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { book, author, category, quantity, price } = req.body;
    console.log(req.params);
    console.log(req.body);
    const bookUpdated = await prisma.book.update({
      where: { id },
      data: { book, author, category, quantity, price },
    });
    console.log(bookUpdated);
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const handleBookDelete = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(req.params);
    const book = await prisma.book.delete({ where: { id } });
    console.log(book);
    next();
    // res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  handleBookUpload,
  handleGetAllBooks,
  handleGetAvailableBooks,
  handleGetAvailableBooksByUserId,
  handleBookUpdate,
  handleBookDetailUpdate,
  handleBookDelete,
  handleGetAvailableBooksByCategory,
  handleGetAvailableBooksByCategoryUserId,
};
