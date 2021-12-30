import { plainToClass } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
	Development = "development",
	Production = "production",
	Test = "test"
}

class EnvironmentVariables {
	@IsEnum(Environment)
	NODE_ENV: Environment;

	@IsNumber()
	PORT: number;

	@IsString()
	@IsNotEmpty()
	JWT_SECRET: string;

	@IsInt()
	@IsNotEmpty()
	JWT_ACCESS_TOKEN_EXPIRATION_HOUR: number;


	@IsInt()
	@IsNotEmpty()
	LOGIN_ATTEMPT_THRESHOLD: number;

	@IsString()
	@IsNotEmpty()
	MONGODB_URI: string;

	@IsString()
	@IsNotEmpty()
	TOOKAN_API_URL: string;

	@IsString()
	@IsNotEmpty()
	TOOKAN_API_KEY: string;
}

export function validate(config: Record<string, unknown>) {
	const validatedConfig = plainToClass(
		EnvironmentVariables,
		config,
		{ enableImplicitConversion: true },
	);
	const errors = validateSync(validatedConfig, { skipMissingProperties: false });

	if (errors.length > 0) {
		throw new Error(errors.toString());
	}
	return validatedConfig;
}