export const AUTH_ERRORS = {
	USERNAME_ALREADY_EXISTS: "Username already exists.",
	EMAIL_ALREADY_EXISTS: "Email already exists.",
	USERNAME_DOES_NOT_EXIST: "Username does not exist.",
	INCORRECT_PASSWORD: "Incorrect password.",
	NO_REFRESH_TOKEN: "No refresh token available",
	GENERIC_ERROR: "An error occurred.",
};

export function getErrorMessage(error: any): string {
	return error.message || error.response?.data || AUTH_ERRORS.GENERIC_ERROR;
}

export function handleAuthErrors(form: any, errorMsg: string) {
	const errors = errorMsg.split("; ");
	let usernameErrorSet = false;
	let passwordErrorSet = false;

	errors.forEach((err) => {
		if (err.includes(AUTH_ERRORS.USERNAME_ALREADY_EXISTS)) {
			form.setError("username", {
				type: "manual",
				message: "This username is already taken",
			});
			usernameErrorSet = true;
		}
		if (err.includes(AUTH_ERRORS.EMAIL_ALREADY_EXISTS)) {
			form.setError("email", {
				type: "manual",
				message: "This email is already used",
			});
		}
		if (err.includes(AUTH_ERRORS.USERNAME_DOES_NOT_EXIST)) {
			form.setError("username", {
				type: "manual",
				message: "This username does not exist",
			});
			usernameErrorSet = true;
		}
		if (err.includes(AUTH_ERRORS.INCORRECT_PASSWORD)) {
			form.setError("password", {
				type: "manual",
				message: "Incorrect password",
			});
			passwordErrorSet = true;
		}
		if (err.includes(AUTH_ERRORS.NO_REFRESH_TOKEN)) {
			form.setError("username", {
				type: "manual",
				message: "An error occurred",
			});
			form.setError("password", {
				type: "manual",
				message: "An error occurred",
			});
		}
	});

	if (!usernameErrorSet && errorMsg.includes(AUTH_ERRORS.USERNAME_DOES_NOT_EXIST)) {
		form.setError("username", {
			type: "manual",
			message: "This username does not exist",
		});
	}
	if (!passwordErrorSet && errorMsg.includes(AUTH_ERRORS.INCORRECT_PASSWORD)) {
		form.setError("password", {
			type: "manual",
			message: "Incorrect password",
		});
	}
}
