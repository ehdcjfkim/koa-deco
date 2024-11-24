import "reflect-metadata";

export function Params(): ParameterDecorator {
	return (target: Record<string, any>, propertyKey: string | symbol | undefined, parameterIndex: number) => {
		const paramTypes = Reflect.getMetadata("design:paramtypes", target, propertyKey!);
		const paramType = paramTypes[parameterIndex];

		const existingParams = Reflect.getMetadata("params", target, propertyKey!) || [];
		existingParams.push({
			type: "params",
			index: parameterIndex,
			paramType,
		});
		Reflect.defineMetadata("params", existingParams, target, propertyKey!);

		const method = (target as Record<string, any>)[propertyKey as string];
		Reflect.defineMetadata("handler:target", target, method);
		Reflect.defineMetadata("handler:propertyKey", propertyKey, method);
	};
}

export function Query(): ParameterDecorator {
	return (target: Record<string, any>, propertyKey: string | symbol | undefined, parameterIndex: number) => {
		const paramTypes = Reflect.getMetadata("design:paramtypes", target, propertyKey!);
		const paramType = paramTypes[parameterIndex];

		const existingParams = Reflect.getMetadata("params", target, propertyKey!) || [];
		existingParams.push({
			type: "query",
			index: parameterIndex,
			paramType,
		});
		Reflect.defineMetadata("params", existingParams, target, propertyKey!);

		const method = (target as Record<string, any>)[propertyKey as string];
		Reflect.defineMetadata("handler:target", target, method);
		Reflect.defineMetadata("handler:propertyKey", propertyKey, method);
	};
}
export function Body(): ParameterDecorator {
	return (target: Record<string, any>, propertyKey: string | symbol | undefined, parameterIndex: number) => {
		const paramTypes = Reflect.getMetadata("design:paramtypes", target, propertyKey!);
		const paramType = paramTypes[parameterIndex];

		const existingParams = Reflect.getMetadata("params", target, propertyKey!) || [];
		existingParams.push({
			type: "body",
			index: parameterIndex,
			paramType,
		});
		Reflect.defineMetadata("params", existingParams, target, propertyKey!);

		const method = target[propertyKey as string];
		Reflect.defineMetadata("handler:target", target, method);
		Reflect.defineMetadata("handler:propertyKey", propertyKey, method);
	};
}
