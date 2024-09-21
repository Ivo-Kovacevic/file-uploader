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
        const existingFolder = await prisma.folder.findFirst({
            where: {
                name: newFolderName,
                userId: userId,
                parentId: parentId,
            },
        });

        if (existingFolder) {
            return "Folder name already exists";
        }
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
        return folder;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.getFolderContent = async (rootFolder, subfoldersPathArray) => {
    try {
        // Get current folder with subfolders
        let currentFolder = await prisma.folder.findUnique({
            where: {
                id: rootFolder.id,
            },
            include: {
                subfolders: true,
            },
        });
        // Shift array so first element is subfolder name and not root folder name
        subfoldersPathArray.shift();

        for (let i = 0; i < subfoldersPathArray.length; i++) {
            const folderName = subfoldersPathArray[i];

            const subfolder = currentFolder.subfolders.find((subfolder) => {
                return subfolder.name === folderName;
            });
            if (subfolder) {
                const subfolderId = subfolder.id;
                currentFolder = await prisma.folder.findUnique({
                    where: {
                        id: subfolderId,
                        name: folderName,
                    },
                    include: {
                        subfolders: true,
                    },
                });
            } else if (folderName && folderName !== "create-folder") {
                return (currentFolder = null);
            }
        }
        return currentFolder;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
