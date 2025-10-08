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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const setMetadata_1 = require("../auth/decoration/setMetadata");
const user_dto_1 = require("./dto/user.dto");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    create(createUserDto, user) {
        return this.userService.createUser(createUserDto, user);
    }
    async getUsers(query) {
        console.log('🔍 User Controller - Standardized query received:', query);
        if (query.qs && !query.search) {
            console.log('🔍 Converting legacy qs parameter to search:', query.qs);
            const qsParts = query.qs.split(',');
            const searchPart = qsParts.find(part => part.includes('search='));
            if (searchPart) {
                query.search = searchPart.split('=')[1];
            }
        }
        const result = await this.userService.searchUsers(query);
        return result;
    }
    findOne(id) {
        return this.userService.findOneID(id);
    }
    async getUserCount() {
        const total = await this.userService.countUsers();
        return { total };
    }
    update(id, updateUserDto, user) {
        return this.userService.update(id, updateUserDto, user);
    }
    remove(id, user) {
        return this.userService.remove(id, user);
    }
};
exports.UserController = UserController;
__decorate([
    (0, setMetadata_1.CustomMessage)('Create new user'),
    (0, setMetadata_1.Permission)('user:create'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, setMetadata_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "create", null);
__decorate([
    (0, setMetadata_1.Permission)('user:findAll'),
    (0, setMetadata_1.CustomMessage)('Fetch List user with Paginate'),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.SearchUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsers", null);
__decorate([
    (0, setMetadata_1.Permission)('user:findOne'),
    (0, setMetadata_1.CustomMessage)('Fetch user by ID'),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findOne", null);
__decorate([
    (0, setMetadata_1.Public)(),
    (0, common_1.Get)('count'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserCount", null);
__decorate([
    (0, setMetadata_1.Permission)('user:update'),
    (0, setMetadata_1.CustomMessage)('Update user by ID'),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, setMetadata_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "update", null);
__decorate([
    (0, setMetadata_1.Permission)('user:remove'),
    (0, setMetadata_1.CustomMessage)('Delete user by ID'),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, setMetadata_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "remove", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map