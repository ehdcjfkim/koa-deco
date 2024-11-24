import metadata from "./metadata";

//class decorator
export function Controller(baseRoute?: string) {
	return function <T extends new (...args: any[]) => {}>(constructors: T) {
		const paramType = Reflect.getMetadata("design:paramtypes", constructors) || [];

		let tempInstance: any = new constructors();
		// const paramName = Object.keys(tempInstance);
		tempInstance = null;
		// const params = paramName.reduce((acc, cur, idx) => {
		// 	acc[cur] = paramType[idx]?.name ?? paramType[idx];
		// 	return acc;
		// }, {} as { [paramName: string]: any });

		class ExtendedConstructor extends constructors {
			private static instance: ExtendedConstructor;
			private constructor(...args: any[]) {
				super(...args);
				if (typeof ExtendedConstructor.instance === "object") {
					return ExtendedConstructor.instance;
				}
				ExtendedConstructor.instance = this;
			}
		}

		metadata.add(constructors)("path", baseRoute);
		metadata.add(constructors)("class", ExtendedConstructor);
		// metadata.add(constructors)("paramTypes", params);
	};
}

//class decorator  || method decorator
export function Middleware(middleware: Function) {
	return function (target: Function | Record<string, any>, key?: string) {
		metadata.add(target, key)("middleware", middleware);
	};
}

//method decorator
export function Get(path: string | RegExp) {
	return function (target: Record<string, any>, key: string): void {
		const argumentTypes = Reflect.getMetadata("design:paramtypes", target, key);
		metadata.add(target, key)("verb", "get");
		metadata.add(target, key)("path", path);
		metadata.add(target, key)("target", target[key]);
		metadata.add(target, key)("argumentTypes", argumentTypes);
	};
}

//method decorator
export function Post(path: string | RegExp) {
	return function (target: Record<string, any>, key: string): void {
		const argumentTypes = Reflect.getMetadata("design:paramtypes", target, key);
		metadata.add(target, key)("verb", "post");
		metadata.add(target, key)("path", path);
		metadata.add(target, key)("target", target[key]);
		metadata.add(target, key)("argumentTypes", argumentTypes);
	};
}

//method decorator
export function Patch(path: string | RegExp) {
	return function (target: Record<string, any>, key: string): void {
		const argumentTypes = Reflect.getMetadata("design:paramtypes", target, key);
		metadata.add(target, key)("verb", "patch");
		metadata.add(target, key)("path", path);
		metadata.add(target, key)("target", target[key]);
		metadata.add(target, key)("argumentTypes", argumentTypes);
	};
}

//method decorator
export function Put(path: string | RegExp) {
	return function (target: Record<string, any>, key: string): void {
		const argumentTypes = Reflect.getMetadata("design:paramtypes", target, key);
		metadata.add(target, key)("verb", "put");
		metadata.add(target, key)("path", path);
		metadata.add(target, key)("target", target[key]);
		metadata.add(target, key)("argumentTypes", argumentTypes);
	};
}

//method decorator
export function Delete(path: string | RegExp) {
	return function (target: Record<string, any>, key: string): void {
		const argumentTypes = Reflect.getMetadata("design:paramtypes", target, key);
		metadata.add(target, key)("verb", "delete");
		metadata.add(target, key)("path", path);
		metadata.add(target, key)("target", target[key]);
		metadata.add(target, key)("argumentTypes", argumentTypes);
	};
}
