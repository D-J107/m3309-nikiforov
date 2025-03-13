"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
let AppController = class AppController {
    home(req) {
        return { username: req.session.user ? req.session.user.username : null };
    }
    personalAccount(req) {
        return { username: req.session.user ? req.session.user.username : null };
    }
    businessPartners(req) {
        return { username: req.session.user ? req.session.user.username : null };
    }
    contacts(req) {
        return { username: req.session.user ? req.session.user.username : null };
    }
    delivery(req) {
        return { username: req.session.user ? req.session.user.username : null };
    }
    payment(req) {
        return { username: req.session.user ? req.session.user.username : null };
    }
    reviews(req) {
        return { username: req.session.user ? req.session.user.username : null };
    }
    vacancy(req) {
        return { username: req.session.user ? req.session.user.username : null };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('/'),
    (0, common_1.Render)('index'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "home", null);
__decorate([
    (0, common_1.Get)('/personal_account'),
    (0, common_1.Render)('personal_account'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "personalAccount", null);
__decorate([
    (0, common_1.Get)('/business_partners'),
    (0, common_1.Render)('business_partners'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "businessPartners", null);
__decorate([
    (0, common_1.Get)('/contacts'),
    (0, common_1.Render)('contacts'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "contacts", null);
__decorate([
    (0, common_1.Get)('/delivery'),
    (0, common_1.Render)('delivery'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "delivery", null);
__decorate([
    (0, common_1.Get)('/payment'),
    (0, common_1.Render)('payment'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "payment", null);
__decorate([
    (0, common_1.Get)('/reviews'),
    (0, common_1.Render)('reviews'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "reviews", null);
__decorate([
    (0, common_1.Get)('/vacancy'),
    (0, common_1.Render)('vacancy'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "vacancy", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)()
], AppController);
//# sourceMappingURL=app.controller.js.map