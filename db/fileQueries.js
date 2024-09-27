const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.storeFile = async (fileName, hashedName, path, size, folderId) => {
    try {
        const existingFile = await exports.fileExists(fileName, folderId);
        if (existingFile) {
            return "File with that name already exists";
        }
        return await prisma.file.create({
            data: {
                name: fileName,
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

exports.fileExists = async (fileName, folderId) => {
    try {
        return (existingFile = await prisma.file.findFirst({
            where: {
                name: fileName,
                folderId: folderId,
            },
        }));
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.renameFile = async (fileName, fileId, folderId) => {
    try {
        const existingFile = await exports.fileExists(fileName, folderId);
        if (existingFile) {
            return "File with that name already exists";
        }
        return await prisma.file.update({
            where: {
                id: parseInt(fileId),
            },
            data: {
                name: fileName,
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

exports.getFileByName = async (fileName, folderId) => {
    try {
        return await prisma.file.findMany({
            where: {
                name: fileName,
                folderId: folderId,
            },
        });
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
};

exports.getFileById = async (fileId) => {
    try {
        return await prisma.file.findUnique({
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

exports.changeFile = async (newFileName, fileId, folderId) => {
    try {
        const existingFile = await prisma.file.findFirst({
            where: {
                name: newFileName,
                folderId: parseInt(folderId),
            },
        });
        if (existingFile && existingFile.id !== parseInt(fileId)) {
            return "File name already exists";
        }
        return await prisma.file.update({
            where: {
                id: parseInt(fileId),
            },
            data: {
                name: newFileName,
            },
        });
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
};
