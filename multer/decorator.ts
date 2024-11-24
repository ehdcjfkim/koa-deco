import metadata from "../metadata/metadata";
import upload from "./multer";

type UploadOption = {
	name: string;
	maxCount?: number | undefined;
};

export function UploadSingle(fileName: string) {
	return function (target: Record<string, any>, key?: string) {
		const middleware = upload.single(fileName);
		console.log("middle", target, key);
		metadata.add(target, key)("middleware", middleware);
	};
}

export function UploadMultiple(options: UploadOption[]) {
	return function (target: Record<string, any>, key?: string) {
		const middleware = upload.fields(options);

		metadata.add(target, key)("middleware", middleware);
	};
}
