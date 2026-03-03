"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const morgan_1 = __importDefault(require("morgan"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, morgan_1.default)('dev'));
    app.enableCors({
        origin: ['http://localhost:3000', 'https://master-job-saas.vercel.app'],
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type,Authorization',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const PORT = process.env.PORT || 10000;
    await app.listen(PORT, '0.0.0.0');
    console.log(`🚀 Backend running on port ${PORT}`);
}
bootstrap();
//# sourceMappingURL=main.js.map