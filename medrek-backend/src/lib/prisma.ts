const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Warm up connection on cold starts
prisma.$connect()

module.exports = { prisma }