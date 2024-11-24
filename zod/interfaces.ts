import type { SchemaObject as SchemaObject30 } from "openapi3-ts/oas30";
import type { SchemaObject } from "openapi3-ts/oas31";
import type { z, ZodTypeAny, AnyZodObject } from "zod";

export interface OpenApiZodAny extends ZodTypeAny {
	metaOpenApi?: SchemaObject | SchemaObject[];
}

export interface OpenApiZodAnyObject extends AnyZodObject {
	metaOpenApi?: SchemaObject | SchemaObject[];
}

export type OpenAPIVersion = "3.0" | "3.1";

export interface ParsingArgs<T> {
	zodRef: T;
	schemas: SchemaObject[];
	useOutput?: boolean;
	hideDefinitions?: string[];
	openApiVersion: OpenAPIVersion;
}
export type TupleToUnion<ArrayType> = ArrayType extends readonly unknown[] ? ArrayType[number] : never;

type PickIndexSignature<ObjectType> = {
	[KeyType in keyof ObjectType as object extends Record<KeyType, unknown> ? KeyType : never]: ObjectType[KeyType];
};

type OmitIndexSignature<ObjectType> = {
	[KeyType in keyof ObjectType as object extends Record<KeyType, unknown> ? never : KeyType]: ObjectType[KeyType];
};

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] };

type RequiredFilter<Type, Key extends keyof Type> = undefined extends Type[Key]
	? Type[Key] extends undefined
		? Key
		: never
	: Key;

type OptionalFilter<Type, Key extends keyof Type> = undefined extends Type[Key]
	? Type[Key] extends undefined
		? never
		: Key
	: never;

type EnforceOptional<ObjectType> = Simplify<
	{
		[Key in keyof ObjectType as RequiredFilter<ObjectType, Key>]: ObjectType[Key];
	} & {
		[Key in keyof ObjectType as OptionalFilter<ObjectType, Key>]?: Exclude<ObjectType[Key], undefined>;
	}
>;

type SimpleMerge<Destination, Source> = {
	[Key in keyof Destination | keyof Source]: Key extends keyof Source
		? Source[Key]
		: Key extends keyof Destination
		? Destination[Key]
		: never;
};

export type Merge<Destination, Source> = EnforceOptional<
	SimpleMerge<PickIndexSignature<Destination>, PickIndexSignature<Source>> &
		SimpleMerge<OmitIndexSignature<Destination>, OmitIndexSignature<Source>>
>;

export type CompatibleZodType = Pick<z.ZodType<unknown>, "_input" | "_output" | "parse" | "safeParse">;
export type CompatibleZodInfer<T extends CompatibleZodType> = T["_output"];

export type MergeZodSchemaOutput<T extends CompatibleZodType> = T extends z.ZodDiscriminatedUnion<string, infer Options>
	? Merge<
			object,
			TupleToUnion<{
				[X in keyof Options]: Options[X] extends z.ZodType ? Options[X]["_output"] : Options[X];
			}>
	  >
	: T extends z.ZodUnion<infer UnionTypes>
	? UnionTypes extends z.ZodType[]
		? Merge<
				object,
				TupleToUnion<{
					[X in keyof UnionTypes]: UnionTypes[X] extends z.ZodType
						? UnionTypes[X]["_output"]
						: UnionTypes[X];
				}>
		  >
		: T["_output"]
	: T["_output"];
export type ZodDtoStatic<T extends CompatibleZodType = CompatibleZodType> = {
	new (): MergeZodSchemaOutput<T>;
	zodSchema: T;
	create(input: unknown): CompatibleZodInfer<T>;
};

// Used for transforming the SchemaObject in _OPENAPI_METADATA_FACTORY
export type SchemaObjectForMetadataFactory = Omit<SchemaObject30, "required"> & {
	required: boolean | string[];
};
