"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const jwt_1 = require("@nestjs/jwt");
const bcrypt_1 = require("bcrypt");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./schemas/user.schema");
const mongoose_2 = __importStar(require("mongoose"));
const config_1 = require("@nestjs/config");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let UserService = class UserService {
    userModel;
    JwtService;
    configService;
    constructor(userModel, JwtService, configService) {
        this.userModel = userModel;
        this.JwtService = JwtService;
        this.configService = configService;
    }
    hashedSomething = async (something) => {
        const salt = (0, bcrypt_1.genSaltSync)(10);
        const hashedSomething = await (0, bcrypt_1.hash)(something, salt);
        return hashedSomething;
    };
    findByEmail = async (email) => {
        return this.userModel.findOne({ email }).exec();
    };
    async createUser(createUserDto, user) {
        const { name, email, password, phone, address, role } = createUserDto;
        const hashedPassword = await this.hashedSomething(password);
        const existedEmail = await this.findByEmail(email);
        if (existedEmail) {
            throw new common_1.BadRequestException('Email already exists');
        }
        else {
            const newUser = await this.userModel.create({
                name,
                email,
                password: hashedPassword,
                phone,
                avatar: createUserDto.avatar,
                address,
                role: role || 'User',
                createdBy: {
                    email: user.email,
                },
            });
            const populatedUser = await this.userModel
                .findById(newUser._id)
                .populate({
                path: 'role',
                select: 'name',
            })
                .select('-password -refreshToken')
                .exec();
            return populatedUser;
        }
    }
    async searchUsers(query) {
        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc', role, status, } = query;
        console.log('🔍 SearchUsers called with standardized query:', query);
        let filter = {};
        if (search && search.trim()) {
            const searchFilter = (0, pagination_dto_1.buildSearchFilter)(search, ['name', 'email']);
            filter = { ...filter, ...searchFilter };
        }
        if (role && role !== 'all') {
            filter.role = role;
        }
        if (status && status !== 'all') {
        }
        console.log('🔍 Final filter applied:', filter);
        const sort = (0, pagination_dto_1.buildSortObject)(sortBy, sortOrder);
        console.log('🔍 Sort applied:', sort);
        const total = await this.userModel.countDocuments(filter);
        console.log('🔍 Total documents found:', total);
        const skip = (page - 1) * limit;
        const data = await this.userModel
            .find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate({
            path: 'role',
            select: 'name',
        })
            .select('-password -refreshToken')
            .exec();
        console.log(`✅ Found ${data.length} users on page ${page}`);
        console.log('🔍 First user sample:', {
            name: data[0]?.name,
            email: data[0]?.email,
        });
        const result = new pagination_dto_1.PaginationResponseDto(data, total, page, limit);
        console.log('🚀 User Service - Returning standardized format:', {
            hasData: !!result.data,
            dataLength: result.data ? result.data.length : 0,
            hasMeta: !!result.meta,
            metaTotal: result.meta ? result.meta.total : 'no meta',
            resultKeys: Object.keys(result)
        });
        return result;
    }
    parseQueryString(qs) {
        const conditions = {};
        console.log('🔍 Parsing query string:', qs);
        console.log('🔍 Decoded query string:', decodeURIComponent(qs));
        const decodedQs = decodeURIComponent(qs);
        let pairs;
        if (decodedQs.includes('&')) {
            pairs = decodedQs.split('&').map((pair) => pair.trim());
            console.log('🔍 Detected URL encoded format (&)');
        }
        else {
            pairs = decodedQs.split(',').map((pair) => pair.trim());
            console.log('🔍 Detected comma separated format (,)');
        }
        console.log('🔍 Split pairs:', pairs);
        for (const pair of pairs) {
            const [key, value] = pair.split('=');
            if (key && value) {
                const cleanKey = key.trim();
                const cleanValue = value.trim();
                conditions[cleanKey] = cleanValue;
                console.log(`✅ Parsed condition: ${cleanKey} = ${cleanValue}`);
            }
        }
        console.log('🔍 Final parsed conditions:', conditions);
        return conditions;
    }
    async buildMongoFilter(conditions) {
        const filter = {};
        const validFields = [
            'role',
            'status',
            'name',
            'email',
            'phone',
            'search',
            'sortBy',
            'sortOrder',
        ];
        console.log('🔍 Building MongoDB filter for conditions:', conditions);
        for (const [key, value] of Object.entries(conditions)) {
            if (validFields.includes(key)) {
                if (key === 'sortBy' || key === 'sortOrder') {
                    console.log(`ℹ️ Skipping sort parameter: ${key}`);
                }
                else if (key === 'role') {
                    console.log(`🔍 Searching for role with name: ${value}`);
                    const roleModel = this.userModel.db.model('Role');
                    const allRoles = await roleModel.find({}).select('_id name').exec();
                    console.log('🔍 All roles in DB:', allRoles);
                    const matchingRoles = await roleModel
                        .find({
                        name: { $regex: value, $options: 'i' },
                    })
                        .select('_id name');
                    console.log('🔍 Found matching roles for "' + value + '":', matchingRoles);
                    if (matchingRoles.length > 0) {
                        const roleIds = matchingRoles.map((role) => role._id);
                        const roleStrings = matchingRoles.map((role) => role._id.toString());
                        filter.role = {
                            $in: [...roleIds, ...roleStrings],
                        };
                        console.log('✅ Role filter applied with both ObjectId and string:', filter.role);
                    }
                    else {
                        filter.role = null;
                        console.log('❌ No matching roles found, setting role filter to null');
                    }
                }
                else if (key === 'search') {
                    filter.$or = [
                        { name: { $regex: value, $options: 'i' } },
                        { email: { $regex: value, $options: 'i' } },
                    ];
                    console.log('✅ Search filter applied:', filter.$or);
                }
                else if (key === 'name' || key === 'email' || key === 'phone') {
                    filter[key] = { $regex: value, $options: 'i' };
                    console.log(`✅ ${key} filter applied:`, filter[key]);
                }
                else {
                    filter[key] = value;
                    console.log(`✅ ${key} exact match filter applied:`, value);
                }
            }
            else {
                console.log(`⚠️ Skipping invalid field: ${key}`);
            }
        }
        console.log('🔍 Final MongoDB filter:', filter);
        return filter;
    }
    async searchUsersByRoleName(query) {
        const { page = 1, limit = 10, qs, sortBy, sortOrder } = query;
        const aggregationPipeline = [];
        if (qs) {
            const searchConditions = this.parseQueryString(qs);
            aggregationPipeline.push({
                $lookup: {
                    from: 'roles',
                    localField: 'role',
                    foreignField: '_id',
                    as: 'roleDetails',
                },
            });
            const matchConditions = {};
            Object.entries(searchConditions).forEach(([key, value]) => {
                if (key === 'role') {
                    matchConditions['roleDetails.name'] = {
                        $regex: value,
                        $options: 'i',
                    };
                }
                else if (key === 'name' || key === 'email') {
                    matchConditions[key] = { $regex: value, $options: 'i' };
                }
                else if (['status', 'phone'].includes(key)) {
                    matchConditions[key] = value;
                }
            });
            if (Object.keys(matchConditions).length > 0) {
                aggregationPipeline.push({ $match: matchConditions });
            }
        }
        if (sortBy) {
            const sortObj = {};
            sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;
            aggregationPipeline.push({ $sort: sortObj });
        }
        const countPipeline = [...aggregationPipeline, { $count: 'total' }];
        const countResult = await this.userModel.aggregate(countPipeline);
        const total = countResult[0]?.total || 0;
        const safePage = page || 1;
        const safeLimit = limit || 10;
        const skip = (safePage - 1) * safeLimit;
        aggregationPipeline.push({ $skip: skip }, { $limit: safeLimit });
        const data = await this.userModel.aggregate(aggregationPipeline);
        const totalPages = Math.ceil(total / safeLimit);
        const hasNext = safePage < totalPages;
        const hasPrev = safePage > 1;
        return {
            data,
            total,
            page: safePage,
            limit: safeLimit,
            totalPages,
            hasNext,
            hasPrev,
        };
    }
    async findOneID(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid ID format');
        }
        const user = await this.userModel
            .findById(id)
            .populate({
            path: 'role',
            select: 'name',
        })
            .select('-password -refreshToken')
            .exec();
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        return user;
    }
    async countUsers() {
        return this.userModel.countDocuments();
    }
    async update(id, updateUserDto, user) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid ID format');
        }
        const userExist = await this.userModel.findById(id).exec();
        if (!userExist) {
            throw new common_1.BadRequestException('User not found');
        }
        else {
            const updatedUser = {
                ...updateUserDto,
                updatedBy: user
                    ? {
                        _id: user._id,
                        email: user.email,
                    }
                    : undefined,
            };
            const updated = await this.userModel
                .findByIdAndUpdate(id, updatedUser, { new: true })
                .populate({
                path: 'role',
                select: 'name',
            })
                .select('-password -refreshToken')
                .exec();
            return updated;
        }
    }
    async remove(id, user) {
        if (id === user._id.toString()) {
            throw new common_1.BadRequestException('Cannot remove yourself');
        }
        if (!mongoose_2.default.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid ID');
        }
        const userExist = await this.userModel.findById(id).exec();
        if (!userExist) {
            throw new common_1.BadRequestException('User not found');
        }
        await this.userModel.findByIdAndUpdate(id, {
            deletedBy: {
                _id: user._id,
                email: user.email,
            },
        });
        await this.userModel.softDelete({ _id: id });
        return {
            message: 'User deleted successfully',
            deletedBy: {
                _id: user._id,
                email: user.email,
            },
        };
    }
    async validatePassword(plainPassword, hashedPassword) {
        return await (0, bcrypt_1.compare)(plainPassword, hashedPassword);
    }
    async findUserByEmail(email) {
        return this.userModel.findOne({ email });
    }
    async findUserWithRoleAndPermissions(userId) {
        return this.userModel
            .findById(userId)
            .populate({
            path: 'role',
            populate: {
                path: 'permissions',
            },
        })
            .exec();
    }
    async register(user) {
        const { name, email, password } = user;
        const hashedPassword = await this.hashedSomething(password);
        const existedEmail = await this.findByEmail(email);
        if (existedEmail) {
            throw new common_1.BadRequestException('Email already exists');
        }
        else {
            const newUser = await this.userModel.create({
                name,
                email,
                password: hashedPassword,
            });
            return newUser;
        }
    }
    async updateRefreshToken(userId, refreshToken) {
        if (!mongoose_2.Types.ObjectId.isValid(userId)) {
            throw new common_1.BadRequestException('Invalid user ID format');
        }
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        user.refreshToken = refreshToken;
        await user.save();
    }
    async findUserByAccessToken(accessToken) {
        try {
            const payload = await this.JwtService.verifyAsync(accessToken, {
                secret: this.configService.get('JWT_SECRET_TOKEN_SECRET'),
            });
            const user = await this.userModel.findById(payload._id).exec();
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            return user;
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [Object, jwt_1.JwtService,
        config_1.ConfigService])
], UserService);
//# sourceMappingURL=user.service.js.map