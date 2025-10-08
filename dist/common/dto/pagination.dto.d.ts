export declare class PaginationQueryDto {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
}
export declare class PaginationMetaDto {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    constructor(total: number, page: number, limit: number);
}
export declare class PaginationResponseDto<T> {
    data: T[];
    meta: PaginationMetaDto;
    constructor(data: T[], total: number, page: number, limit: number);
}
export declare function buildSortObject(sortBy: string, sortOrder?: 'asc' | 'desc'): Record<string, 1 | -1>;
export declare function buildSearchFilter(search: string, searchFields: string[]): Record<string, any>;
