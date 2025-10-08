"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = exports.PERMISSION_KEY = exports.User = exports.CustomMessage = exports.MESSAGE_KEY = exports.Public = exports.IS_PUBLIC_KEY = void 0;
exports.IsOnlyOneDefined = IsOnlyOneDefined;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
exports.IS_PUBLIC_KEY = 'isPublic';
const Public = () => (0, common_1.SetMetadata)(exports.IS_PUBLIC_KEY, true);
exports.Public = Public;
exports.MESSAGE_KEY = 'custom_message';
const CustomMessage = (message) => (0, common_1.SetMetadata)(exports.MESSAGE_KEY, message);
exports.CustomMessage = CustomMessage;
exports.User = (0, common_2.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
exports.PERMISSION_KEY = 'permissions';
const Permission = (...permissions) => (0, common_1.SetMetadata)(exports.PERMISSION_KEY, permissions);
exports.Permission = Permission;
function IsOnlyOneDefined(properties, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isOnlyOneDefined',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(_, args) {
                    const obj = args.object;
                    const definedCount = properties.filter((prop) => obj[prop] !== undefined).length;
                    return definedCount === 1;
                },
            },
        });
    };
}
//# sourceMappingURL=setMetadata.js.map