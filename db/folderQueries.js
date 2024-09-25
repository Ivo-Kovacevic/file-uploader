const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

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
        return await prisma.folder.create({
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

exports.renameFolder = async (folderName, folderId, userId, parentId) => {
    try {
        const existingFolder = await prisma.folder.findFirst({
            where: {
                name: folderName,
                userId: userId,
                parentId: parentId,
            },
        });
        if (existingFolder) {
            return "Folder name already exists";
        }
        return await prisma.folder.update({
            where: {
                id: parseInt(folderId),
            },
            data: {
                name: folderName,
            },
        });
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
