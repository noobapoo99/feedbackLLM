import jwt from "jsonwebtoken";

export const socketAuth = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Unauthorized: token missing"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to socket (same as req.user)
      socket.user = decoded;

      next();
    } catch (err) {
      return next(new Error("Unauthorized: invalid token"));
    }
  });
};
