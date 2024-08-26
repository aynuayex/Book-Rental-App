const { PrismaClient } = require('@prisma/client');
const EventEmitter = require('events');
const prisma = require('./prisma');

class DBConnector extends EventEmitter {
    constructor() {
        super();
        this.prisma = prisma;
    }

    async connect() {
        try {
            await this.prisma.$connect();
            console.log("Connected to Neon DB");
            this.emit('connected'); // Emit an event once connected
        } catch (error) {
            console.error("Failed to connect to Neon DB:", error);
            this.emit('error', error); // Emit an error event if connection fails
            process.exit(1); // Exit the process if connection fails
        }
    }

    async disconnect() {
        await this.prisma.$disconnect();
        console.log("Prisma disconnected From Neon DB");
    }
}

module.exports = new DBConnector();
