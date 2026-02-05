import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
	const authHeader = req.headers.authorization || req.headers.Authorization;
	const token = authHeader && authHeader.startsWith("Bearer ")
		? authHeader.split(" ")[1]
		: null;

	if (!token) return res.status(401).json({ message: "No token" });

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.adminId = decoded.id;
		next();
	} catch (err) {
		return res.status(401).json({ message: "Invalid token" });
	}
}
