import Router, { type IMiddleware } from "koa-router";
import { type Context, type Next } from "koa";
import "koa-body";
import "reflect-metadata";
import { ZodObject } from "zod";

export class CustomRouter {
	private router: any;

	constructor() {
		this.router = new Router();
	}

	private createHandler(handler: Function) {
		const target = Reflect.getMetadata("handler:target", handler);
		const propertyKey = Reflect.getMetadata("handler:propertyKey", handler);

		if (!target || !propertyKey) {
			throw new Error("Handler metadata not found. Ensure the method is decorated.");
		}

		return async (ctx: Context) => {
			const paramsMetadata = Reflect.getMetadata("params", target, propertyKey) || [];
			const args = [];

			for (const param of paramsMetadata) {
				const { type, index, paramType } = param;
				let value;
				if (type === "params") {
					value = ctx.params;
				} else if (type === "query") {
					value = ctx.query;
				} else if (type === "body") {
					value = ctx.request.body;
				}

				try {
					if (paramType.schema) value = paramType.create(value);
				} catch (error: any) {
					console.error(error);
					ctx.status = 400;
					ctx.body = {
						error: "Validation failed",
						details: error?.errors,
					};
					return;
				}

				args[index] = value;
			}

			const boundHandler = handler.bind(target);
			const result = await boundHandler(...args);
			ctx.body = result;
		};
	}

	get(path: string, middlewares: IMiddleware[], handler: Function) {
		this.router.get(path, ...middlewares, this.createHandler(handler));
	}

	post(path: string, middlewares: IMiddleware[], handler: Function) {
		this.router.post(path, ...middlewares, this.createHandler(handler));
	}

	patch(path: string, middlewares: IMiddleware[], handler: Function) {
		this.router.patch(path, ...middlewares, this.createHandler(handler));
	}
	put(path: string, middlewares: IMiddleware[], handler: Function) {
		this.router.put(path, ...middlewares, this.createHandler(handler));
	}
	delete(path: string, middlewares: IMiddleware[], handler: Function) {
		this.router.delete(path, ...middlewares, this.createHandler(handler));
	}

	routes() {
		return this.router.routes();
	}

	allowedMethods() {
		return this.router.allowedMethods();
	}
}
