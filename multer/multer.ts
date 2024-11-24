import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
// import Config from '@boxgo/config';
import Boom from '@hapi/boom';

function koaMulter(options?: any) {
	const m = multer(options);

	makePromise(m, 'any');
	makePromise(m, 'array');
	makePromise(m, 'fields');
	makePromise(m, 'none');
	makePromise(m, 'single');

	return m;
}

function makePromise(multer: any, name: any) {
	if (!multer[name]) return;

	const fn = multer[name];

	multer[name] = function () {
		// eslint-disable-next-line prefer-rest-params
		const middleware = Reflect.apply(fn, this, arguments);

		return async (ctx: any, next: any) => {
			await new Promise((resolve, reject) => {
				middleware(ctx.req, ctx.res, (err: Error) => {
					if (err) return reject(err);
					if ('request' in ctx) {
						if (ctx.req.body) {
							ctx.request.body =
								ctx.req.body;
							delete ctx.req.body;
						}

						if (ctx.req.file) {
							ctx.request.file =
								ctx.req.file;
							ctx.file = ctx.req.file;
							delete ctx.req.file;
						}

						if (ctx.req.files) {
							ctx.request.files =
								ctx.req.files;
							ctx.files =
								ctx.req.files;
							delete ctx.req.files;
						}
					}

					resolve(ctx);
				});
			});

			return next();
		};
	};
}

koaMulter.diskStorage = multer.diskStorage;
koaMulter.memoryStorage = multer.memoryStorage;

const storage = koaMulter.diskStorage({
	destination: (req, file, cb) => {
		cb(
			null,
			path.join(
				process.cwd(),
				// Config.getInstance().SERVER.uploadPath
				'/uploads'
				// public하게 접근할 수 있는 상태
				// 개인정보에 관한 파일을 업로드하는 경우가 있어 보안에 신경써야함.
			)
		);
	},
	filename: (req, file, cb) => {
		cb(null, uuidv4());
	},
});

const upload = koaMulter({
	storage,
	fileFilter: (req: any, file: any, cb: any) => {
		if (
			// !Config.getInstance().SERVER.uploadMimeType.includes(
			// 	file.mimetype
			// )
			![
				'image/png',
				'image/jpeg',
				'image/jpg',
				'image/webp',
				'application/pdf',
			].includes(file.mimetype)
		) {
			cb(null, false);
			return cb(Boom.unsupportedMediaType());
		}

		file.originalname = Buffer.from(
			file.originalname,
			'latin1'
		).toString('utf8');
		cb(null, true);
	},
});

export default upload;
