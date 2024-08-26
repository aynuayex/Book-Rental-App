const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const handleNewUser = async (req, res) => {
  try {
    console.log(req.body);
    const { fullName, email, password, confirmPassword, location, phoneNumber, role } = req.body;
    if (!fullName || !email || !password || !location || !phoneNumber || !role) {
      return res
        .status(400)
        .json({ message: "full Name, email, password, location, phoneNumber and role are required!" });
      }
    //check for duplicate users in the db
    // const duplicate = await prisma.user.findFirst({
    //   where: {fullName, email, role}
    // });
    const duplicate = await prisma.user.findUnique({
      where: {email}
    });
    if (duplicate) return res.status(409).json({"message": "user already exist with that information, Please change Email!"}); //Conflict
      // encrypt password
      const hashedPwd = await bcrypt.hash(password, 10);

      // create JWTs
      const accessToken = jwt.sign(
        { userInfo: { fullName, email, role } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      const refreshToken = jwt.sign(
        { userInfo: { fullName, email, role } },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      // create and store the new user
      const result = await prisma.user.create({
        data: {fullName, email, password: hashedPwd, location, phoneNumber, refreshToken: [refreshToken], role }
      });
      console.log(result);
      
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true, // comment this when using thunderclient to test refreshToken otherwise cookie will not be set on req.cookies
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(201).json({ success: `New user ${fullName} with role ${role} created!`, id: result.id, email, fullName, role, accessToken  });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
