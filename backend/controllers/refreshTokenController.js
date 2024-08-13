const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  try {
  const cookies = req.cookies;
  // console.log(cookies);
  if (!cookies?.jwt) return res.sendStatus(401);
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  const foundUser = await prisma.user.findFirst({ where: {refreshToken: { has: refreshToken }} });
  console.log(foundUser);
  // Detected refresh token reuse!
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403); //forbidden(expired)
        const {fullName, email, role} = decoded.userInfo;
        const hackedUser = await prisma.user.update({
          where: {fullName, email, role},data: {
            refreshToken: []
          }
        });
        console.log(hackedUser);
      }
    );
    return res.sendStatus(403); //forbidden
  }
  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt != refreshToken
  );
  //evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if(err){
        //forbidden(expired)
        const {fullName, email, role} = foundUser;
        const expiredTokenUser = await prisma.user.update({
          where: {fullName, email, role},data: {
            refreshToken: [...newRefreshTokenArray]
          }
        });
        console.log(expiredTokenUser);
      }
      if (err || foundUser.fullName !== decoded.userInfo.fullName) {
        console.log("hi");
        return res.sendStatus(403);
      }
      // refreshToken was still valid
      const {fullName, email, role} = decoded.userInfo;
      const accessToken = jwt.sign(
        { userInfo: { fullName, email, role }},
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
 
      const newRefreshToken = jwt.sign(
        {userInfo: { fullName, email, role }},
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      // Saving newRefreshToken with current user
      const result = await prisma.user.update({where: {fullName, email, role}, data: {refreshToken: [...newRefreshTokenArray, newRefreshToken]}})
      console.log(result);

      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true, // comment this when using thunderclient to test refreshToken otherwise cookie will not be set on req.cookies
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ id: result.id, email: result.email, fullName: result.fullName, role, accessToken });
    }
  );
  
} catch (err) {
  res.status(500).json({ message: err.message });   
}
};

module.exports = { handleRefreshToken };
