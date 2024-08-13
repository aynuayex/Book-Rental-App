const prisma = require("../config/prisma");

const handleGetAllOwners = async (req, res) => {
  try {
    const allOwners = await prisma.user.findMany({
      where: { role: "OWNER" },
      include: { _count: { select: { books: true } } },
    });
    const allOwnersWithBookCounts = allOwners.map(owner => ({...owner, _count: owner._count.books}));
    console.log(allOwnersWithBookCounts);
    res.status(200).json({ allOwners: allOwnersWithBookCounts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const handleOwnerUpdate = async (req, res) => {
  try {
    const {id} = req.params;
    const {approved} = req.body;
    console.log(req.params);
    console.log(req.body);
    const owner = await prisma.user.update({where: {id}, data: {approved}});
    console.log(owner);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const handleOwnerDelete = async (req, res, next) => {
  try {
    const {id} = req.params;
    console.log(req.params);
    const owner = await prisma.user.delete({where: {id}});
    console.log(owner);
    next();
    // res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleGetAllOwners, handleOwnerUpdate, handleOwnerDelete };
