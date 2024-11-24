import type { SchemaObject as SchemaObject30 } from "openapi3-ts/oas30";
import type { ReferenceObject, SchemaObject as SchemaObject31, SchemaObject } from "openapi3-ts/oas31";
import type {
	CompatibleZodInfer,
	MergeZodSchemaOutput,
	OpenApiZodAny,
	SchemaObjectForMetadataFactory,
	ZodDtoStatic,
} from "./interfaces";
import { generateSchema } from "./parse";
import z, { type ZodTypeAny } from "zod";

export function extendApi<T extends OpenApiZodAny>(schema: T, schemaObject: SchemaObject = {}): T {
	const This = (schema as any).constructor;
	const newSchema = new This(schema._def);
	newSchema.metaOpenApi = Object.assign({}, schema.metaOpenApi || {}, schemaObject);
	return newSchema;
}

export const createZodClass = <T extends ZodTypeAny>(schema: T) => {
	class ZodClass {
		public static schema = schema;

		constructor() {}

		static create(data: unknown) {
			const validateData = ZodClass.schema.parse(data);
			return validateData;
		}
	}
	return ZodClass as { new (data: z.infer<T>): ZodClass; schema: T };
};
