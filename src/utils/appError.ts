class AppError extends Error {
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'Failed' : 'Error';

    this.isOperatinal = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
export default AppError;
