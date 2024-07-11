namespace Backend.Helpers
{
    // RESULT CLASS - GENERIC
    public class Result<T>
    {
        // PROPERTIES - IS SUCCESS, VALUE, ERROR
        public bool IsSuccess { get; }
        public T? Value { get; }
        public string? Error { get; }

        // CONSTRUCTOR
        protected Result(T? value, bool isSuccess, string? error)
        {
            Value = value;
            IsSuccess = isSuccess;
            Error = error;
        }

        // METHODS - SUCCESS, FAILURE
        public static Result<T> Success(T value) => new Result<T>(value, true, null);
        public static Result<T> Success() => new Result<T>(default!, true, null);
        public static Result<T> Failure(string error) => new Result<T>(default(T), false, error);
    }
}
