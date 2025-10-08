import { ValidationOptions } from 'class-validator';
export declare const IS_PUBLIC_KEY = "isPublic";
export declare const Public: () => import("@nestjs/common").CustomDecorator<string>;
export declare const MESSAGE_KEY = "custom_message";
export declare const CustomMessage: (message: string) => import("@nestjs/common").CustomDecorator<string>;
export declare const User: (...dataOrPipes: unknown[]) => ParameterDecorator;
export declare const PERMISSION_KEY = "permissions";
export declare const Permission: (...permissions: string[]) => import("@nestjs/common").CustomDecorator<string>;
export declare function IsOnlyOneDefined(properties: string[], validationOptions?: ValidationOptions): (object: object, propertyName: string) => void;
