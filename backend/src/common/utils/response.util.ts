export const createResponse = (statusCode: number, message: string, data?: any) => {
  return {
    statusCode,
    message,
    ...(data && { data }),
  };
};

export const createErrorResponse = (statusCode: number, message: string) => {
  return createResponse(statusCode, message);
};

export const createSuccessResponse = (statusCode: number, data?: any) => {
  return createResponse(statusCode, 'Success', data);
};
