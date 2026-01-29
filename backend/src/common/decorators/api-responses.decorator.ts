import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiCreatedResponse as BaseApiCreatedResponse,
  ApiOkResponse as BaseApiOkResponse,
  ApiBadRequestResponse as BaseApiBadRequestResponse,
  ApiResponseMetadata,
} from '@nestjs/swagger';
import { ExamplesObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

type ApiResponseOptionsExtend = ApiResponseMetadata & {
  description: string;
  type: Type<unknown>;
  success?: ExamplesObject;
  error?: ExamplesObject;
};

const wrapApiOkResponse = (
  options: ApiResponseMetadata,
  examples?: ExamplesObject,
) => {
  const { type, ...restOptions } = options;
  const hasExamples = examples && Object.keys(examples).length > 0;

  return BaseApiOkResponse({
    ...restOptions,
    description: options?.description || 'Success',
    type: type,
    ...(hasExamples && {
      content: {
        'application/json': {
          examples,
        },
      },
    }),
  });
};

const wrapApiCreatedResponse = (
  options: ApiResponseMetadata,
  examples?: ExamplesObject,
) => {
  const { type, ...restOptions } = options;
  const hasExamples = examples && Object.keys(examples).length > 0;

  return BaseApiCreatedResponse({
    ...restOptions,
    description: options?.description || 'Created successfully',
    type: type,
    ...(hasExamples && {
      content: {
        'application/json': {
          examples,
        },
      },
    }),
  });
};

const wrapApiBadRequestResponse = (examples?: ExamplesObject) => {
  const hasExamples = examples && Object.keys(examples).length > 0;

  return BaseApiBadRequestResponse({
    description: 'Bad Request',
    ...(hasExamples && {
      content: {
        'application/json': {
          examples,
        },
      },
    }),
  });
};

/**
 * Standard API responses for CREATE operations (POST)
 * Includes: 201 Created, 400 Bad Request
 * @example
 * @ApiCreatedResponse({
 *   description: 'User created successfully',
 *   type: CreateUserResponseDto,
 *   success: { successExample: { value: { ... } } },
 *   error: { errorExample: { value: { ... } } },
 * })
 */
export const ApiCreatedResponse = (options: ApiResponseOptionsExtend) => {
  const { success, error, ...restOptions } = options;

  return applyDecorators(
    wrapApiCreatedResponse(restOptions, success),
    wrapApiBadRequestResponse(error),
  );
};

/**
 * Standard API responses for READ operations (GET)
 * Includes: 200 OK, 400 Bad Request
 * @example
 * @ApiReadResponses({
 *   description: 'Users retrieved successfully',
 *   type: UserListResponseDto,
 *   success: { successExample: { value: { ... } } },
 *   error: { errorExample: { value: { ... } } },
 * })
 */
export const ApiReadResponses = (options: ApiResponseOptionsExtend) => {
  const { success, error, ...restOptions } = options;

  return applyDecorators(
    wrapApiOkResponse(restOptions, success),
    wrapApiBadRequestResponse(error),
  );
};

/**
 * Standard API responses for UPDATE operations (PUT/PATCH)
 * Includes: 200 OK, 400 Bad Request
 */
export const ApiUpdateResponses = (options: ApiResponseOptionsExtend) => {
  const { success, error, ...restOptions } = options;

  return applyDecorators(
    wrapApiOkResponse(restOptions, success),
    wrapApiBadRequestResponse(error),
  );
};

/**
 * Standard API responses for DELETE operations
 * Includes: 200 OK, 400 Bad Request
 */
export const ApiDeleteResponses = (options: ApiResponseOptionsExtend) => {
  const { success, error, ...restOptions } = options;

  return applyDecorators(
    wrapApiOkResponse(restOptions, success),
    wrapApiBadRequestResponse(error),
  );
};
