export const isSessionOn = () => {
    return async (req, res, next) => {
        const token = req.header('Authorization')?.split(' ')[1];
        if (token === undefined) {
            next();
        } else {
            res.redirect("/users");
        }
    }
}