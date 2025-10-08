import { PaginationQueryDto } from '../../common/dto/pagination.dto';
export declare class SearchUserDto extends PaginationQueryDto {
    role?: string;
    status?: string;
    qs?: string;
}
export declare class PaginationResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
