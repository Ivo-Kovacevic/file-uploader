const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("express-async-handler");

const prisma = new PrismaClient();

exports.registerUser = async (username, password) => {
    try {
        await prisma.user.create({
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
        const allUsers = await prisma.user.findUnique({
            where: {
                username: username,
            },
        });
        return allUsers;
    } catch (error) {
        console.error("Error while registering user: ", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
};

exports.getUserByUsername = async (username) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username,
            },
        });
        return user;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
};

exports.getUserById = async (id) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
            include: {
                folders: true,
            },
        });
        return user;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
};

exports.createNewFolder = async (newFolderName, userId, parentId) => {
    try {
        const folder = await prisma.folder.create({
            data: {
                name: newFolderName,
                user: {
                    connect: {
                        id: userId,
                    },
                },
                parent: {
                    connect: {
                        id: parentId,
                    },
                },
            },
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.getFolderContent = async (rootFolder, pathArray) => {
    try {
        let currentFolder = rootFolder;
        for (let i = 1; i <= pathArray.length; i++) {
            const folderName = pathArray[i];
            let folder = await prisma.folder.findUnique({
                where: {
                    id: currentFolder.id,
                },
                include: {
                    subfolders: true,
                },
            });
            currentFolder = folder;
            const subfolder = folder.subfolders.find((subfolder) => {
                return subfolder.name === folderName;
            });
            if (subfolder) {
                const subfolderId = subfolder.id;
                currentFolder = await prisma.folder.findUnique({
                    where: {
                        id: subfolderId,
                        name: folderName,
                    },
                });
            }
        }

        return currentFolder;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
