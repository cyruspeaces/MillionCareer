import { NextResponse } from "next/server";

export type ApiSuccess<T> = {
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
  };
};

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
  };
};

export function ok<T>(data: T, meta?: ApiSuccess<T>["meta"], init?: ResponseInit) {
  return NextResponse.json({ data, meta } satisfies ApiSuccess<T>, init);
}

export function fail(
  code: string,
  message: string,
  status = 400,
  init?: ResponseInit,
) {
  return NextResponse.json(
    { error: { code, message } } satisfies ApiErrorBody,
    { status, ...init },
  );
}
