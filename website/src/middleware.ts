import { defineMiddleware } from "astro:middleware";
import { SpanStatusCode, trace } from "@opentelemetry/api";

const tracer = trace.getTracer("astro");

// The Node adapter serves from a bare http server, so the auto-instrumented
// server span has no route. Name it from Astro's route pattern and wrap the
// render in its own span. At build time (prerender) no SDK is registered and
// every call here is a no-op.
export const onRequest = defineMiddleware(async (context, next) => {
  const method = context.request.method;
  const route = context.routePattern;

  const serverSpan = trace.getActiveSpan();
  serverSpan?.updateName(`${method} ${route}`);
  serverSpan?.setAttribute("http.route", route);

  return tracer.startActiveSpan(`render ${route}`, async (span) => {
    span.setAttribute("http.request.method", method);
    span.setAttribute("http.route", route);
    span.setAttribute("astro.prerendered", context.isPrerendered);
    try {
      const response = await next();
      span.setAttribute("http.response.status_code", response.status);
      if (response.status >= 500) {
        span.setStatus({ code: SpanStatusCode.ERROR });
      }
      return response;
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: String(error) });
      throw error;
    } finally {
      span.end();
    }
  });
});
