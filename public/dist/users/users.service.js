"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
let UsersService = class UsersService {
    users = [];
    registerUser(userData) {
        const { username, password, email } = userData;
        const existingUser = this.users.find(user => user.email === email);
        if (existingUser) {
            return { statusCode: 419, message: "User account already registered!" };
        }
        this.users.push({ username, password, email });
        return { statusCode: 201, message: "User registered successfully!" };
    }
    loginUser(loginData) {
        const { email, password } = loginData;
        const user = this.users.find(user => user.email === email && user.password === password);
        if (!user) {
            return { statusCode: 401, message: "User account does not exist!" };
        }
        return {
            statusCode: 201,
            message: "Login successfull!",
            user: {
                username: user.username,
                email: user.email
            }
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
//# sourceMappingURL=users.service.js.map