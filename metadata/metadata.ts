import "reflect-metadata";
import Boom from "@hapi/boom";
import type { Context, Next } from "koa";

export type ControllerMetadata = {
	[key: string]: {
		actions: {
			[actionKey: string]: {
				middleware?: Array<(ctx: Context, next: Next) => Promise<any>>;
				verb: string;
				path: string;
				target: any;
				security?: Array<{
					[key: string]: Array<string>;
				}>;
				argTypes?: Array<any>;
			};
		};
	};
};

class Metadata {
	private static instance: any;
	controllers: any;
	schemas: any;
	services: any;

	private constructor() {
		this.controllers = {};
		this.schemas = {};
	}

	public static getInstance(): Metadata {
		Metadata.instance ??= new Metadata();
		return Metadata.instance;
	}

	// private extractRespItem(response: any) {
	// 	const respKey = response.code;
	// 	const respValue: Record<string, any> = {};
	// 	// const response = new respClass();

	// 	if (response.description) {
	// 		respValue.description = response.description;
	// 	}

	// 	if (response.content) {
	// 		respValue["content"] = {};
	// 		respValue["content"]["application/json"] = {
	// 			schema: {
	// 				$ref: `#/components/schemas/${response.content.name}`,
	// 			},
	// 		};
	// 	}

	// 	if (response.headers) {
	// 		const header = this.schemas[response.headers.name].properties;

	// 		respValue["headers"] = Object.entries(header).reduce(
	// 			(r: Record<string, any>, [key, value]: [string, Record<string, any>]) => {
	// 				const headerValue: Record<string, any> = {
	// 					schema: {
	// 						type: value.type,
	// 					},
	// 				};
	// 				if (value.example) headerValue.schema.example = value.example;
	// 				if (value.description) headerValue.description = value.description;
	// 				r[key] = headerValue;
	// 				return r;
	// 			},
	// 			{} as Record<string, any>
	// 		);
	// 	}

	// 	const respItem: Record<string, any> = {};
	// 	respItem[respKey] = respValue;
	// 	return respItem;
	// }

	public add(target: any, key?: string, index?: number) {
		return (type: string, data?: any) => {
			console.log(typeof target);
			if (typeof index === "number") {
				//arguments
				const controllerName = target.constructor.name;
				const controller = this.controllers[controllerName] ?? {};
				controller.actions ??= {};

				const methodName = key!;
				controller.actions[methodName] ??= {};
				controller.actions[methodName].arguments ??= {};
				controller.actions[methodName].arguments[index] = type;
				this.controllers[controllerName] = controller;
			} else if (typeof target === "object" && key) {
				//action
				const controllerName = target.constructor.name;
				const controller = this.controllers[controllerName] ?? {};
				controller.actions ??= {};

				const methodName = key;
				controller.actions[methodName] ??= {};
				if (type === "middleware" || type === "security") {
					controller.actions[methodName] ??= {};
					controller.actions[methodName][type] ??= [];
					controller.actions[methodName][type].push(data);
				} else if (type === "responses") {
					// data = this.extractRespItem(data);
					// controller.actions[methodName][type] = {
					// 	...controller.actions[methodName][type],
					// 	...data,
					// };
				} else {
					controller.actions[methodName][type] = data;
				}
				this.controllers[controllerName] = controller;
			} else if (typeof target === "function" && type === "service") {
				const serviceName = target.name;
				this.services[serviceName] = target;
			} else if (typeof target === "function") {
				if (type === "service") return;
				//controller
				const controllerName = target.name;
				const controller = this.controllers[controllerName] ?? {};

				if (type === "middleware" || type === "security") {
					controller[type] ??= [];
					controller[type].push(data);
				} else if (type === "responses") {
					// data = this.extractRespItem(data);
					controller[type] = {
						...controller[type],
						...data,
					};
				} else {
					controller[type] = data;
				}
				this.controllers[controllerName] = controller;
			}

			// console.log(JSON.stringify(this.controllers, null, 2));

			return;
		};
	}
}

const metadata = Metadata.getInstance();
export default metadata;
