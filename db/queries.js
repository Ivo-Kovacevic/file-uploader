const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("express-async-handler");

const prisma = new PrismaClient();

exports.registerUser = async (username, password) => {
    try {
        return await prisma.user.create({
            data: {
                username: username,
                password: password,
                folders: {
                    create: {
                        name: "drive",
                    },
                },
            },
        });
    } catch (error) {
        console.error("Error while registering user: ", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
};

exports.getUserByUsername = async (username) => {
    try {
        return (user = await prisma.user.findUnique({
            where: {
                username: username,
            },
        }));
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
};

exports.getUserById = async (id) => {
    try {
        return (user = await prisma.user.findUnique({
            where: {
                id: id,
            },
            include: {
                folders: true,
            },
        }));
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
};
