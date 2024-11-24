import Koa from "koa";
import { CustomRouter } from "./custom.router";
import bodyParser from "koa-body";
import { Params, Query, Body } from "./metadata/parameter.decorator";
import { z } from "zod";
import { createZodClass } from "./zod";
import { Controller, Get, Post } from "./metadata/router.decorator";
import metadata from "./metadata/metadata";
import { UploadSingle } from "./multer";

const app = new Koa();

const router = new CustomRouter();

const tt = z.object({ id: z.coerce.number() });

class TTT extends createZodClass(tt) {}

const xx = z.object({ limit: z.coerce.number().optional(), page: z.coerce.number().optional() });

class XX extends createZodClass(xx) {}

class TestService {
	private kk: string;
	constructor() {
		this.kk = "kkkll";
	}

	log() {
		console.log(this.kk);
	}
}

@Controller("/test")
export class TestController {
	private k: string;
	private testService = new TestService();
	constructor() {
		this.k = "KKK";
	}

	@Get("/test")
	async test(@Params() params: TTT, @Query() query: XX) {
		return { success: true, data: params };
	}

	@Get("/category")
	async getCategories(@Query() query: { limit: number }) {
		return { success: true, query };
	}

	@Post("")
	@UploadSingle("file")
	async createCategory(@Body() body: { name: string }) {
		this.testService.log();
		return { success: true, name: body };
	}
}

const t = new TestController();

router.get("/:id/test", [], t.test);
router.post("/test", [], t.createCategory);

app.use(bodyParser());

app.use(router.routes());
app.use(router.allowedMethods());

console.log(metadata.schemas);
app.listen(3000);
