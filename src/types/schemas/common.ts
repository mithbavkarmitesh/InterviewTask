import { ZodRecord, ZodArray, ZodObject } from "zod";
import { genericSchema } from "./auth";

export function createExtendedSchema<
  T extends
    | ZodObject<any, any, any, any>
    | ZodArray<any, any>
    | ZodRecord<any, any>
>(dataSchema: T) {
  return genericSchema.extend({
    data: dataSchema,
  });
}
