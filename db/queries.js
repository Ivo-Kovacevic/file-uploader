const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("express-async-handler");

const prisma = new PrismaClient();

exports.registerUser = async (username, password) => {
    try {
        await prisma.user.create({
            data: {
                username: username,
                password: password,
            },
        });
        const allUsers = await prisma.user.findMany();
        return allUsers;
    } catch (error) {
        console.error("Error while registering user: ", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
};
