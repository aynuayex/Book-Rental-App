const prisma = require("../config/prisma");

const updateMonthlyEarnings = async (req, res) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  try {
    const { id } = req.params;
    // const { approved, rented } = req.body;

    const book = await prisma.book.findUnique({ where: { id } });
    // Calculate this month's earnings
    const currentMonthEarnings = await prisma.rental.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId: book.uploadedById,
        rentedAt: {
          gte: new Date(currentYear, currentMonth, 1),
          lt: new Date(currentYear, currentMonth + 1, 1),
        },
      },
    });
    console.log({ currentMonthEarnings });
    // Upsert the monthly earnings
    const monthlyEarnings = await prisma.monthlyEarnings.upsert({
      where: {
        userId_year_month: {
          userId: book.uploadedById,
          year: currentYear,
          month: currentMonth + 1,
        },
      },
      update: {
        totalEarnings: currentMonthEarnings._sum.amount || 0,
      },
      create: {
        userId: book.uploadedById,
        year: currentYear,
        month: currentMonth + 1,
        totalEarnings: currentMonthEarnings._sum.amount || 0,
      },
    });

    console.log("Monthly earnings updated successfully");
    console.log(monthlyEarnings);
    res.sendStatus(204);
  } catch (error) {
    console.error("Error updating monthly earnings:", error);
  }
};

const getMonthlyEarningsData = async (req, res) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const user = await prisma.user.findUnique({
    where: { email: req?.user?.email },
  });
  const userId = user?.id;

  const currentMonthEarnings = await prisma.monthlyEarnings.findUnique({
    where: {
      userId_year_month: {
        year: currentYear,
        month: currentMonth,
        userId,
      },
    },
  });

  console.log({ currentMonthEarnings });

  const previousMonthEarnings = await prisma.monthlyEarnings.findUnique({
    where: {
      userId_year_month: {
        year: currentYear,
        month: currentMonth - 1,
        userId,
      },
    },
  });

  console.log({ previousMonthEarnings });

  const percentageChange =
    (((currentMonthEarnings?.totalEarnings || 0) -
      (previousMonthEarnings?.totalEarnings || 0)) /
      ((currentMonthEarnings?.totalEarnings || 0) +
        (previousMonthEarnings?.totalEarnings || 0))) *
    100;

  res.status(200).json({
    currentMonthEarnings: currentMonthEarnings?.totalEarnings || 0,
    previousMonthEarnings: previousMonthEarnings?.totalEarnings || 0,
    percentageChange,
  });
};

const getTotalMonthlyEarningsData = async (req, res) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const currentMonthTotalEarnings = await prisma.monthlyEarnings.aggregate({
    _sum: {
      totalEarnings: true,
    },
    where: {
      year: currentYear,
      month: currentMonth,
    },
  });

  console.log({ currentMonthTotalEarnings });

  const previousMonthTotalEarnings = await prisma.monthlyEarnings.aggregate({
    _sum: {
      totalEarnings: true,
    },
    where: {
      year: currentYear,
      month: currentMonth - 1,
    },
  });

  console.log({ previousMonthTotalEarnings });

  const percentageChange =
    (((currentMonthTotalEarnings?._sum?.totalEarnings || 0) -
      (previousMonthTotalEarnings?._sum?.totalEarnings || 0)) /
      ((currentMonthTotalEarnings?._sum?.totalEarnings || 0) +
        (previousMonthTotalEarnings?._sum?.totalEarnings || 0))) *
    100;

  res.status(200).json({
    currentMonthEarnings: currentMonthTotalEarnings?._sum?.totalEarnings || 0,
    previousMonthEarnings: previousMonthTotalEarnings?._sum?.totalEarnings || 0,
    percentageChange,
  });
};

const getTotalMonthRangeEarningsData = async (req, res) => {
  let Data = [];
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const user = req.user.role === "SYSADMIN" ? undefined : await prisma.user.findUnique({ where: { email: req?.user?.email }});
  const userId = user?.id;

  for (let i = currentMonth; i > currentMonth - 6; i--) {
    const MonthlyTotalEarningCurrentYear =
      await prisma.monthlyEarnings.aggregate({
        _sum: {
          totalEarnings: true,
        },
        where: {
          year: currentYear,
          month: i,
          ...(userId && {userId})
        },
      });
    const MonthlyTotalEarningLastYear = await prisma.monthlyEarnings.aggregate({
      _sum: {
        totalEarnings: true,
      },
      where: {
        year: currentYear - 1,
        month: i,
        ...(userId && {userId})
      },
    });
    const date = new Date(); // Create a new Date object
    date.setMonth(i - 1); // Set the month (0-indexed)
    Data.push({
      month: date.toLocaleString("en-US", { month: "short" }),
      currentYear: MonthlyTotalEarningCurrentYear?._sum?.totalEarnings || 0,
      lastYear: MonthlyTotalEarningLastYear?._sum?.totalEarnings || 0,
    });
  }
  console.log({ Data });
  res.status(200).json({ Data : Data.reverse()});
};

module.exports = {
  updateMonthlyEarnings,
  getMonthlyEarningsData,
  getTotalMonthlyEarningsData,
  getTotalMonthRangeEarningsData,
};
