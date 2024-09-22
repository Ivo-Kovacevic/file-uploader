const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("express-async-handler");
const { connect } = require("../routes/driveRouter");

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
        let lastValidFolderId = rootFolder.id;
        let currentFolder = await prisma.folder.findUnique({
            where: {
                id: rootFolder.id,
            },
            include: {
                subfolders: true,
                files: true,
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
                lastValidFolderId = subfolderId;
                currentFolder = await prisma.folder.findUnique({
                    where: {
                        id: subfolderId,
                        name: folderName,
                    },
                    include: {
                        subfolders: true,
                        files: true,
                    },
                });
            } else if (folderName) {
                return { currentFolder: null, lastValidFolderId };
            }
        }

        return { currentFolder };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.deleteFolder = async (folderId) => {
    try {
        await prisma.folder.delete({
            where: {
                id: parseInt(folderId),
            },
        });
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
};

exports.uploadFile = async (name, hashedName, path, size, folderId) => {
    try {
        const existingFile = await prisma.file.findFirst({
            where: {
                name: name,
                folderId: folderId,
            },
        });

        if (existingFile) {
            return "File with that name already exists";
        }
        await prisma.file.create({
            data: {
                name: name,
                hashedName: hashedName,
                path: path,
                size: size,
                folder: {
                    connect: {
                        id: folderId,
                    },
                },
            },
        });
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
};

exports.deleteFile = async (fileId) => {
    try {
        return await prisma.file.delete({
            where: {
                id: parseInt(fileId),
            },
        });
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
};

exports.readFile = async (fileName, folderId) => {
    try {
        return await prisma.file.findMany({
            where: {
                name: fileName,
                folderId: folderId
            },
        });
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
};
