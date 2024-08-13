const verifiedRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req?.user?.role) return res.sendStatus(401);
        const allowedRolesArray = [...allowedRoles];
        console.log(allowedRolesArray);
        console.log(req.user.role);
        // const result = req.roles.map(role => allowedRolesArray.includes(role)).find(val => val === true);
        const result = [req.user.role].map(role => allowedRolesArray.includes(role)).find(val => val === true);
        if(!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifiedRoles;

