const prisma = require("../config/prisma");

const handleRentalInsert = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const { approved, rented } = req.body;

    const book = await prisma.book.findUnique({ where: { id } });

    const userWallet = await prisma.user.findUnique({
      where: {
        id: book.uploadedById,
      },
    });

    const currentAmount = book.price * book.quantity;

    const user = await prisma.user.update({
      where: { id: book.uploadedById },
      data: { wallet: userWallet.wallet + currentAmount },
    });
    console.log(user);

    // Check if the rental already exists
    const existingRental = await prisma.rental.findUnique({
      where: {
        bookId_userId: {
          bookId: book.id,
          userId: book.uploadedById,
        },
      },
    });

    let updatedAmount;
    if (existingRental) {
      // Add the previous amount to the current amount
      updatedAmount = existingRental.amount + currentAmount;
    }
    // Upsert the rental record
    const rental = await prisma.rental.upsert({
      where: {
        bookId_userId: {
          bookId: book.id,
          userId: book.uploadedById,
        },
      },
      update: {
        amount: updatedAmount, // Update with the combined amount
      },
      create: {
        bookId: book.id,
        userId: book.uploadedById,
        amount: currentAmount, // Create with the initial current amount
      },
    });
    console.log(rental);
    next();
    // res.status(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleRentalInsert };
